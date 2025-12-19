# nosecrets-packages

Package distribution for [nosecrets](https://github.com/casoon/nosecrets).

## Packages

| Package | Status | Install |
|---------|--------|---------|
| npm | Ready | `npm install -g @casoon/nosecrets` |
| Homebrew | TODO | `brew install casoon/tap/nosecrets` |
| Scoop | TODO | `scoop install nosecrets` |

## Release Workflow

### 1. Tag in nosecrets erstellen

```bash
cd path/to/nosecrets
git tag v0.2.0
git push --tags
```

### 2. Release Workflow starten

1. https://github.com/casoon/nosecrets-packages/actions
2. **Release** workflow auswaehlen
3. **Run workflow** klicken
4. Version eingeben (z.B. `0.2.0`)
5. **Run workflow** bestaetigen

Der Workflow:
- Baut Binaries fuer alle Plattformen (macOS, Linux, Windows)
- Erstellt GitHub Release in casoon/nosecrets
- Publiziert automatisch zu npm (Trusted Publishing, kein OTP noetig)

## Setup (bereits erledigt)

- [x] npm Trusted Publisher konfiguriert
- [x] RELEASE_TOKEN Secret fuer GitHub Releases
- [ ] Homebrew Formula (casoon/homebrew-tap)
- [ ] Scoop Manifest (casoon/scoop-bucket)

## Secrets

| Secret | Zweck |
|--------|-------|
| `RELEASE_TOKEN` | GitHub PAT fuer Releases in casoon/nosecrets |

npm braucht kein Token - Trusted Publishing authentifiziert via OIDC.
