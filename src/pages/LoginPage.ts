import { BasePage } from "./BasePage";
import { communLoc } from "../locators/communLoc";
/**
 * Exemple de Page Object pour un écran de connexion.
 * Remplace les labels par ceux réels de ton app (idéalement des
 * `accessibilityIdentifier` / `testID` stables plutôt que du texte visible).
 */
export class LoginPage extends BasePage {

  inpEmail = this.screen.getByLabel("Email");; // Remplace par le locator réel de ton champ email
  inpPwd = this.screen.getByLabel("Password");; // Remplace par le locator réel de ton champ mot de passe
  btnSignIn = this.screen.getByRole("button", { name: "Sign In" });; // Remplace par le locator réel de ton bouton de connexion
  elmWlcText = this.screen.getByText("Welcome back");; // Remplace par le locator réel du texte de bienvenue

  async checkWlcPage() {
    await this.screen.getByText("Welcome to the Sauce Labs Demo App").waitFor({ state: "visible", timeout: 10000 });
  }

  get emailField() {
    return this.screen.getByLabel("Email");
  }

  get passwordField() {
    return this.screen.getByLabel("Password");
  }

  get signInButton() {
    return this.screen.getByRole("button", { name: "Sign In" });
  }

  get welcomeText() {
    return this.screen.getByText("Welcome back");
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.signInButton.tap();
  }


}
