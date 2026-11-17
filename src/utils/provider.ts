/**
 * Sélection du "provider" utilisé pour parler aux devices, piloté par la
 * variable d'environnement MW_PROVIDER :
 *
 *   MW_PROVIDER=mobilecli    -> mobilecli local (simulateur/émulateur en local)  [par défaut]
 *   MW_PROVIDER=mobilenext   -> Mobile Next Cloud (devices réels dans le cloud)
 *
 * ⚠️ Note : la clé exacte de configuration pour pointer Mobilewright vers un
 * mobilecli distant ou vers Mobile Next Cloud peut évoluer avec les
 * versions du paquet (au moment de la rédaction, `mobilewright screenshot`
 * accepte déjà un flag `--url ws://host:port` pour un mobilecli distant).
 * Vérifie la doc officielle (https://github.com/mobile-next/mobilewright et
 * https://mobilenext.ai) avant mise en prod, et ajuste `buildProviderUse()`
 * ci-dessous si le nom du champ diffère dans ta version installée.
 */

export type Provider = "mobilecli" | "mobilenext";

export function resolveProvider(): Provider {
  const raw = (process.env.MW_PROVIDER ?? "mobilecli").toLowerCase();
  return raw === "mobilenext" ? "mobilenext" : "mobilecli";
}

/**
 * Construit le fragment de config `use` à fusionner dans mobilewright.config.ts
 * selon le provider choisi.
 */
export function buildProviderUse(provider: Provider = resolveProvider()) {
  if (provider === "mobilenext") {
    const url = process.env.MOBILENEXT_URL;
    const apiKey = process.env.MOBILENEXT_API_KEY;

    if (!url) {
      console.warn(
        "[mobilewright.config] MW_PROVIDER=mobilenext mais MOBILENEXT_URL n'est pas défini. " +
          "Renseigne l'endpoint Mobile Next Cloud dans ton .env (voir .env.example)."
      );
    }

    return {
      // Ajuste ce champ si la clé officielle diffère (ex: `remoteUrl`, `serverUrl`...)
      url,
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
    };
  }

  // mobilecli local : rien à ajouter, Mobilewright démarre/detecte
  // automatiquement une instance locale de mobilecli.
  return {};
}
