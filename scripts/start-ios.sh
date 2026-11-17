#!/usr/bin/env bash
# Démarre un simulateur iOS local avant de lancer les tests.
# ⚠️ macOS uniquement (Xcode requis) — ne fonctionne pas sous Windows/Linux.
# Usage : bash scripts/start-ios.sh ["iPhone 16"]

set -euo pipefail

DEVICE_NAME="${1:-${MW_IOS_DEVICE_NAME:-iPhone 16}}"

echo "Simulateurs disponibles :"
xcrun simctl list devices available

echo ""
echo "Démarrage de '$DEVICE_NAME'..."
xcrun simctl boot "$DEVICE_NAME" || echo "(déjà démarré, ou nom introuvable — voir la liste ci-dessus)"
xcrun simctl bootstatus "$DEVICE_NAME" -b

echo "Simulateur prêt."
open -a Simulator
