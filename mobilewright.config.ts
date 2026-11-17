import { defineConfig } from "mobilewright";
import { getPlatformProjects, resolvePlatform } from "./src/utils/platform";
import { buildProviderUse, resolveProvider } from "./src/utils/provider";

const platform = resolvePlatform(); // android (défaut) | ios | all
const provider = resolveProvider(); // mobilecli (défaut) | mobilenext

const isCI = !!process.env.CI;

export default defineConfig({
  bundleId: process.env.MW_BUNDLE_ID ?? "com.saucelabs.mydemoapp.android",

  // Chemin vers le .apk/.ipa à installer avant les tests (optionnel : si
  // l'app est déjà installée sur le device/simulateur, tu peux omettre
  // cette clé ou la laisser vide).
  installApps: process.env.MW_APP_PATH || undefined,

  timeout: 80_000,
  globalTimeout: isCI ? 30 * 60_000 : undefined,

  outputDir: "test-results",
  reporter: isCI ? [["junit"], ["html"]] : "list",
  retries: isCI ? 2 : 0,

  // "all" => 2 plateformes en parallèle ; sinon 1 seule plateforme active.
  workers: platform === "all" ? 2 : 1,
  fullyParallel: platform === "all",

  use: {
    actionTimeout: 8_000,
    appLaunchTimeout: 30_000,
    animations: "off",
    ...buildProviderUse(provider),
  },

  // `viewTree` is not part of `use` in current Mobilewright types.
  viewTree: "on-failure" as any,

  expect: {
    timeout: 8_000,
  },

  // Un "project" par plateforme active (android / ios / les deux).
  projects: getPlatformProjects(platform) as any,
});
