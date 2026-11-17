/// <reference types="node" />

/**
 * Sélection de la/des plateforme(s) à tester, pilotée par la variable
 * d'environnement MW_PLATFORM :
 *
 *   MW_PLATFORM=android   -> Android uniquement          (valeur par défaut)
 *   MW_PLATFORM=ios       -> iOS uniquement
 *   MW_PLATFORM=all       -> Android + iOS en parallèle
 *
 * Chaque plateforme devient un "project" Mobilewright (comme les projects
 * de Playwright Test), ce qui permet de les exécuter en parallèle avec
 * `fullyParallel: true` / `workers`.
 */

export type SupportedPlatform = "android" | "ios" | "all";

export interface MobilewrightProjectLike {
  name: string;
  use: {
    platform: "android" | "ios";
    deviceName?: RegExp;
  };
}

export function resolvePlatform(): SupportedPlatform {
  const raw = (process.env.MW_PLATFORM ?? "android").toLowerCase();

  if (raw === "ios" || raw === "all") {
    return raw;
  }

  // Toute valeur inconnue retombe sur "android" par défaut.
  return "android";
}

const ANDROID_PROJECT: MobilewrightProjectLike = {
  name: "android",
  use: {
    platform: "android",
    // Ajuste ce pattern au nom de ton/tes émulateur(s) local(aux)
    // (ex. AVD "Pixel_8_API_34" -> visible comme "Pixel 8" côté `mobilewright devices`)
    deviceName: /.*/,
  },
};

const IOS_PROJECT: MobilewrightProjectLike = {
  name: "ios",
  use: {
    platform: "ios",
    // Ajuste ce pattern au nom de ton simulateur local (ex. "iPhone 16")
    deviceName: /.*/,
  },
};

/**
 * Retourne la liste des "projects" Mobilewright à exécuter en fonction
 * de MW_PLATFORM.
 */
export function getPlatformProjects(
  platform: SupportedPlatform = resolvePlatform()
): MobilewrightProjectLike[] {
  switch (platform) {
    case "ios":
      return [IOS_PROJECT];
    case "all":
      return [ANDROID_PROJECT, IOS_PROJECT];
    case "android":
    default:
      return [ANDROID_PROJECT];
  }
}
