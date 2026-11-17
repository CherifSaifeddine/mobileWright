import type { Screen } from "mobilewright";

/**
 * Classe de base pour tous les Page Objects.
 * Chaque page reçoit le `screen` du device courant (Android OU iOS selon
 * le project actif), donc le même Page Object fonctionne sur les deux
 * plateformes tant que les locators (getByLabel/getByRole/getByText...)
 * restent cohérents entre les deux apps natives.
 */
type RoleType =
  | "button"
  | "textfield"
  | "text"
  | "image"
  | "switch"
  | "checkbox"
  | "slider"
  | "list"
  | "listitem"
  | "tab"
  | "link"
  | "header";


export abstract class BasePage {
  protected screen: Screen;

  constructor(screen: Screen) {
    this.screen = screen;
  }

  //  Méthodes utilitaires pour interagir avec les éléments de l'écran
  //----------------------Click ----------------------
  async click(locator: any) {
  if (typeof locator.click === "function") return await locator.click();
  if (typeof locator.tap === "function") return await locator.tap();
  if (typeof locator.press === "function") return await locator.press();
  throw new Error("No click/tap/press method available");
}


  async longPress(selector: any, param?: string | string[], duration = 500) {
    const elem = await this.resolveElement(selector, param);
    await this.runAction(elem, ["longPress", "pressAndHold"], [duration]);
  }

  async doubleClick(selector: any, param?: string | string[]) {
    const elem = await this.resolveElement(selector, param);
    await this.runAction(elem, ["dblClick", "doubleTap", "doubleClick"], []);
  }

  //----------------------Type ----------------------
async getDynamicLocator(selector: any, param?: string | string[]) {
  let finalSelector = selector.val;
  if (param) {
    if (Array.isArray(param)) {
      param.forEach((p) => {
        finalSelector = finalSelector.replace("$$$$", p);
      });
    } else {
      finalSelector = finalSelector.replace("$$$$", param);
    }
  }
  return finalSelector;
}



  async fill(locator: any, value: string) {
    if (typeof locator.fill === "function") return await locator.fill(value);
    if (typeof locator.type === "function") return await locator.type(value);
    throw new Error("No fill/type method available");
  }


  //----------------------Clear ----------------------
  async clear(locator: any) {
    await this.runAction(locator, ["clear", "clearValue"]);
  }

  async clearAndType(locator: any, value: string) {
    await this.clear(locator);
    await this.fill(locator, value);
  }

  //----------------------Visible and not visible ----------------------
  async isVisible(locator: any) {
    if (typeof (locator as any).isVisible === "function") {
      return await (locator as any).isVisible();
    }
    if (typeof (locator as any).toBeVisible === "function") {
      return true;
    }
    return false;
  }

  async waitForVisible(locator: any, timeout = 10000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (await this.isVisible(locator)) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    return false;
  }

  async waitForHidden(locator: any, timeout = 10000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (!(await this.isVisible(locator))) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    return false;
  }

  async getRoleLocator(selector: { role: RoleType; name?: string }) {
    return this.screen.getByRole(selector.role, selector.name ? { name: selector.name } : undefined);
  }

  async getText(selector: any, param?: string | string[]) {
    const elem = await this.resolveElement(selector, param);
    if (typeof (elem as any).text === "function") {
      return await (elem as any).text();
    }
    if (typeof (elem as any).getText === "function") {
      return await (elem as any).getText();
    }
    throw new Error("Element does not expose a text getter");
  }

  async textOf(selector: any, param?: string | string[]) {
    return this.getText(selector, param);
  }

  async hasText(selector: any, expectedText: string, param?: string | string[]) {
    const actualText = await this.getText(selector, param);
    return String(actualText).includes(expectedText);
  }

  async waitForText(
    selector: any,
    expectedText: string,
    param?: string | string[],
    timeout = 10000
  ) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        const text = await this.getText(selector, param);
        if (String(text).includes(expectedText)) {
          return true;
        }
      } catch {
        // ignore until timeout
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    return false;
  }

  async exists(selector: any, param?: string | string[]) {
    try {
      const elem = await this.resolveElement(selector, param);
      if (typeof (elem as any).exists === "function") {
        return await (elem as any).exists();
      }
      if (typeof (elem as any).isVisible === "function") {
        return await (elem as any).isVisible();
      }
      return true;
    } catch {
      return false;
    }
  }

  //----------------------scroll ----------------------

  async scrollTo(selector: any, param?: string | string[]) {
    const elem = await this.resolveElement(selector, param);
    await this.runAction(elem, ["scrollIntoView", "scrollTo", "scrollIntoViewIfNeeded"]);
    return elem;
  }

  async swipe(direction: "left" | "right" | "up" | "down", distance = 1, duration = 500) {
    const screenAny = this.screen as any;
    if (typeof screenAny.swipe === "function") {
      return await screenAny.swipe(direction, distance, duration);
    }
    if (typeof screenAny.swipeLeft === "function" && direction === "left") {
      return await screenAny.swipeLeft(distance, duration);
    }
    if (typeof screenAny.swipeRight === "function" && direction === "right") {
      return await screenAny.swipeRight(distance, duration);
    }
    if (typeof screenAny.swipeUp === "function" && direction === "up") {
      return await screenAny.swipeUp(distance, duration);
    }
    if (typeof screenAny.swipeDown === "function" && direction === "down") {
      return await screenAny.swipeDown(distance, duration);
    }
    throw new Error(`Swipe direction '${direction}' is not supported by this screen object`);
  }

  async swipeLeft(distance = 1, duration = 500) {
    return this.swipe("left", distance, duration);
  }

  async swipeRight(distance = 1, duration = 500) {
    return this.swipe("right", distance, duration);
  }

  async swipeUp(distance = 1, duration = 500) {
    return this.swipe("up", distance, duration);
  }

  async swipeDown(distance = 1, duration = 500) {
    return this.swipe("down", distance, duration);
  }

  //----------------------get element  ----------------------
  protected async resolveElement(selector: any, param?: string | string[]) {
    let finalSelector = selector.val;
    if (param) {
      if (Array.isArray(param)) {
        param.forEach((p) => {
          finalSelector = finalSelector.replace("$$$$", p);
        });
      } else {
        finalSelector = finalSelector.replace("$$$$", param);
      }
    }
    return finalSelector;
  }



  //----------------------runAction ----------------------

  protected async runAction(
    element: any,
    methodNames: string[],
    args: any[] = []
  ): Promise<any> {
    for (const methodName of methodNames) {
      const method = element?.[methodName];
      if (typeof method === "function") {
        return await method.apply(element, args);
      }
    }

    throw new Error(
      `Element does not support any of these actions: ${methodNames.join(", ")}`
    );
  }
}

