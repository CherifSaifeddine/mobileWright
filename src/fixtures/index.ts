import { test as base, expect } from "@mobilewright/test";
import { LoginPage } from "../pages/LoginPage";
import { WlcPage } from "../pages/WlcPage";

/**
 * Fixtures custom qui étendent celles de @mobilewright/test.
 *
 * - `device` / `screen` / `bundleId` : fournies nativement par
 *   @mobilewright/test (connexion faite une fois par worker).
 * - `loginPage` (et tout autre Page Object ajouté ici) : instancié
 *   automatiquement à partir du `screen` courant, donc déjà connecté
 *   au bon device (Android ou iOS selon le project actif).
 *
 * Ajoute une entrée par Page Object au fur et à mesure du projet,
 * pas besoin de recréer la connexion device à chaque fois.
 */
type CustomFixtures = {
  loginPage: LoginPage;
  wlcPage: WlcPage;
};

export const test = base.extend<CustomFixtures>({
  loginPage: async ({ screen }, use) => {
    await use(new LoginPage(screen));
  },
  wlcPage: async ({ screen }, use) => {
    await use(new WlcPage(screen));
  },

  // Exemple pour ajouter une nouvelle page :
  // homePage: async ({ screen }, use) => {
  //   await use(new HomePage(screen));
  // },
});

export { expect };
