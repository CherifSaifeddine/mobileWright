# mobilewright-project

Projet de tests E2E mobile (Android & iOS) avec [Mobilewright](https://github.com/mobile-next/mobilewright), en TypeScript, basé sur des **fixtures** (`@mobilewright/test`) et des **Page Objects**.

## Structure

```
mobilewright-project/
├── mobilewright.config.ts     # Config centrale : lit MW_PLATFORM / MW_PROVIDER
├── src/
│   ├── fixtures/index.ts      # Fixtures custom : instancie les Page Objects automatiquement
│   ├── pages/                 # Page Objects (LoginPage en exemple)
│   └── utils/
│       ├── platform.ts        # android (défaut) | ios | all -> "projects" Mobilewright
│       └── provider.ts        # mobilecli (défaut, local) | mobilenext (cloud)
├── tests/
│   └── login.test.ts          # Exemple de test utilisant les fixtures
├── apps/                      # Place tes .apk / .ipa ici
├── scripts/
│   ├── start-android.sh       # Démarre un émulateur Android local
│   └── start-ios.sh           # Démarre un simulateur iOS local (macOS uniquement)
├── ci/
│   └── azure-pipelines.yml    # Pipeline CI/CD paramétrable
└── .env.example
```

## Comment ça choisit Android / iOS / les deux

Tout est piloté par la variable d'environnement `MW_PLATFORM`, lue dans `src/utils/platform.ts` :

| `MW_PLATFORM` | Comportement |
|---|---|
| `android` *(défaut)* | 1 seul project actif : Android |
| `ios` | 1 seul project actif : iOS |
| `all` | 2 projects actifs en parallèle (Android + iOS), `fullyParallel: true`, `workers: 2` |

Chaque "project" correspond à un couple `{ platform, deviceName }`, exactement comme les `projects` de Playwright Test. La fixture `device`/`screen` (fournie par `@mobilewright/test`) se connecte alors automatiquement au bon type de device pour chaque worker.

## Comment ça choisit mobilecli (local) / Mobile Next Cloud

Piloté par `MW_PROVIDER`, lu dans `src/utils/provider.ts` :

| `MW_PROVIDER` | Comportement |
|---|---|
| `mobilecli` *(défaut)* | Mobilewright détecte/démarre `mobilecli` en local et cible ton simulateur/émulateur déjà démarré |
| `mobilenext` | Bascule vers [Mobile Next Cloud](https://mobilenext.ai) (devices réels dans le cloud) |

> ⚠️ **Important** : le champ exact de config pour pointer vers Mobile Next Cloud (`url`, `remoteUrl`, header d'auth, etc.) n'était pas encore stabilisé au moment de la rédaction de ce projet. `src/utils/provider.ts` contient un point d'ajustement unique (`buildProviderUse()`) — vérifie la doc officielle Mobile Next Cloud avant la mise en prod et adapte ce fichier si besoin. Tout le reste du projet (fixtures, pages, tests) n'a pas à changer.

## Installation

```bash
npm install
cp .env.example .env
# édite .env : MW_BUNDLE_ID, MW_APP_PATH, etc.
```

Vérifie ton environnement :
```bash
npx mobilewright doctor
```

## Utilisation en local

### 1. Démarrer un device

**Android** (Windows/macOS/Linux) :
```bash
npm run devices:android:start -- Pixel_8
# ou directement : bash scripts/start-android.sh Pixel_8
```

**iOS** (macOS uniquement — impossible sous Windows, voir note plus bas) :
```bash
npm run devices:ios:start -- "iPhone 16"
```

### 2. Lancer les tests

```bash
npm run test:android      # MW_PLATFORM=android (défaut)
npm run test:ios          # MW_PLATFORM=ios
npm run test:all          # MW_PLATFORM=all -> Android + iOS en parallèle

# Variante Mobile Next Cloud (pas besoin de device local) :
npm run test:android:cloud
npm run test:ios:cloud
npm run test:all:cloud
```

Voir le rapport HTML :
```bash
npm run report
```

### Sous Windows

Xcode n'existe que sur macOS — donc en local sur Windows tu ne peux exécuter que `npm run test:android`. Pour tester iOS, deux options :
1. Passer par le pipeline CI/CD (runner macOS)
2. Utiliser `MW_PROVIDER=mobilenext` pour cibler des devices iOS réels dans le cloud sans machine macOS

## CI/CD — Azure DevOps

Le pipeline `ci/azure-pipelines.yml` expose deux paramètres au moment du lancement ("Run pipeline") :

- **`platform`** : `android` *(défaut)* | `ios` | `all`
- **`provider`** : `mobilecli` *(défaut, device local dans le pipeline)* | `mobilenext` *(Mobile Next Cloud)*

Le choix du provider détermine automatiquement l'image d'agent utilisée :
- `mobilecli` → `macos-latest` (seule image Microsoft-hosted avec accélération matérielle pour l'émulateur Android **et** Xcode pour iOS)
- `mobilenext` → `ubuntu-latest` suffit, car aucun device local n'est nécessaire (appels API vers le cloud)

### Variables à définir dans Azure DevOps

Dans **Pipelines > Edit > Variables** (ou un variable group), définis :

| Variable | Requis pour |
|---|---|
| `MW_BUNDLE_ID` | Toujours |
| `MW_APP_PATH` | `provider = mobilecli` (chemin du .apk/.ipa, ex. artifact publié par un job de build en amont) |
| `MOBILENEXT_URL` | `provider = mobilenext` |
| `MOBILENEXT_API_KEY` | `provider = mobilenext` — marquer en **secret** |

Pour brancher ce fichier YAML dans Azure DevOps : **Pipelines > New pipeline > Existing Azure Pipelines YAML file** → sélectionner `ci/azure-pipelines.yml`.

## Ajouter un nouveau Page Object

1. Créer `src/pages/MaPage.ts` en étendant `BasePage`
2. L'exporter dans `src/pages/index.ts`
3. Ajouter une fixture correspondante dans `src/fixtures/index.ts` :
```ts
maPage: async ({ screen }, use) => {
  await use(new MaPage(screen));
},
```
4. L'utiliser dans un test :
```ts
test('...', async ({ maPage }) => { ... });
```

## Notes / points à vérifier avant mise en prod

- Les noms exacts des champs de config Mobile Next Cloud (`provider.ts`) sont à confirmer avec la doc officielle : les paquets et l'API de Mobilewright évoluent encore (projet récent, mi-2026).
- `viewTree: 'on-failure'` dans `mobilewright.config.ts` : vérifie s'il doit être top-level ou dans `use` selon ta version installée (`npx mobilewright --version`).
- Pense à créer/committer un AVD Android et un simulateur iOS de référence pour que les noms utilisés dans `platform.ts` / les scripts correspondent à ton environnement CI et local.
