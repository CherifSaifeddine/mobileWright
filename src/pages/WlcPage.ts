import { BasePage } from "./BasePage";
import { communLoc } from "../locators/communLoc";

// Ajoute ici l'export de chaque nouveau Page Object au fur et à mesure :
// export { HomePage } from './HomePage';
// export { SettingsPage } from './SettingsPage';

export class WlcPage extends BasePage {

    btnMenu = this.screen.getByTestId("com.saucelabs.mydemoapp.android:id/menuIV");
    btnCart = this.screen.getByTestId(communLoc.btnCart);
    imgLogo = this.screen.getByLabel(communLoc.imgLogo);
    Menu_btnLogin = this.screen.getByLabel(communLoc.Menu_btnLogin);

    // get btnMenu() {
    //     // return this.getRoleLocator(communLoc.btnMenu);
    //     return this.screen.getByTestId("com.saucelabs.mydemoapp.android:id/menuIV");
    // }
    // get btnCart() {
    //     return this.screen.getByTestId(communLoc.btnCart);
    // }
    // get imgLogo() {
    //     return this.screen.getByLabel(communLoc.imgLogo);
    // }
    // get Menu_btnLogin() {
    //     return this.screen.getByLabel(communLoc.Menu_btnLogin);
    // }



    async checkWlcPage(): Promise<void> {
        console.log("typeof this.btnMenu: ", typeof this.btnMenu);
        console.log("this.btnMenu: ", this.btnMenu);
        await this.waitForVisible(this.btnMenu);
        await this.waitForVisible(this.btnCart);
        await this.waitForVisible(this.imgLogo);
        await this.click(this.btnMenu);
    }

    async goToLoginPage(): Promise<void> {
        await this.click(this.Menu_btnLogin);
    }


}