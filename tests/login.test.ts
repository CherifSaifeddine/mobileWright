import { test, expect } from "../src/fixtures";

// Surcharge possible par fichier/describe : bundleId, video, viewTree...
test.use({
  video: "retain-on-failure",
});

test.describe("Connexion", () => {
  test("un utilisateur peut se connecter avec des identifiants valides", async ({
    wlcPage,
    device,
    bundleId,
  }) => {
    const appBundleId = bundleId;
    if (!appBundleId) {
      throw new Error("bundleId is undefined");
    }

    // Repart d'un état propre : app relancée à froid
    await device.terminateApp(appBundleId).catch(() => {});
    await device.launchApp(appBundleId);

    await wlcPage.checkWlcPage();

    // await loginPage.login("user@example.com", "password123");

    // await expect(loginPage.welcomeText).toBeVisible();
  });

  // test("un message d'erreur apparaît avec un mauvais mot de passe", async ({
  //   loginPage,
  // }) => {
  //   await loginPage.login("user@example.com", "wrong-password");

  //   await expect(loginPage.emailField).toBeVisible();
  //   // Adapter le sélecteur/texte à ton app réelle
  //   // await expect(screen.getByText('Invalid credentials')).toBeVisible();
  // });
});
