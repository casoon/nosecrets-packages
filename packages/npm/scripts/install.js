const https = require("https");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const VERSION = "0.1.0";
const REPO = "casoon/nosecrets";

const PLATFORMS = {
  "darwin-x64": "nosecrets-x86_64-apple-darwin.tar.gz",
  "darwin-arm64": "nosecrets-aarch64-apple-darwin.tar.gz",
  "linux-x64": "nosecrets-x86_64-unknown-linux-gnu.tar.gz",
  "linux-arm64": "nosecrets-aarch64-unknown-linux-gnu.tar.gz",
  "win32-x64": "nosecrets-x86_64-pc-windows-msvc.zip",
};

const platform = process.platform + "-" + process.arch;
const artifact = PLATFORMS[platform];

if (!artifact) {
  console.error("Unsupported platform: " + platform);
  process.exit(1);
}

const url = "https://github.com/" + REPO + "/releases/download/v" + VERSION + "/" + artifact;
const binDir = path.join(__dirname, "..", "bin");
const archivePath = path.join(binDir, artifact);

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error("Download failed: " + res.statusCode));
        return;
      }
      res.pipe(file);
      file.on("finish", function() { file.close(resolve); });
    }).on("error", reject);
  });
}

async function install() {
  console.log("Downloading nosecrets v" + VERSION + " for " + platform + "...");

  await download(url, archivePath);

  if (artifact.endsWith(".tar.gz")) {
    execSync("tar -xzf " + archivePath + " -C " + binDir, { stdio: "inherit" });
  } else if (artifact.endsWith(".zip")) {
    execSync("unzip -o " + archivePath + " -d " + binDir, { stdio: "inherit" });
  }

  fs.unlinkSync(archivePath);

  // Rename binary to nosecrets-bin to avoid conflicts with the Node.js wrapper
  // npm/pnpm create wrapper scripts for bin entries, so we need a different name
  const extractedBinary = path.join(binDir, process.platform === "win32" ? "nosecrets.exe" : "nosecrets");
  const targetBinary = path.join(binDir, process.platform === "win32" ? "nosecrets-bin.exe" : "nosecrets-bin");
  
  // Remove old target if it exists
  if (fs.existsSync(targetBinary)) {
    fs.unlinkSync(targetBinary);
  }
  
  fs.renameSync(extractedBinary, targetBinary);
  
  if (process.platform !== "win32") {
    fs.chmodSync(targetBinary, 0o755);
  }

  console.log("nosecrets installed successfully!");
}

install().catch(function(err) {
  console.error("Installation failed:", err.message);
  process.exit(1);
});
