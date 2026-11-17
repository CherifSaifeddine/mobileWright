#!/usr/bin/env bash
# Démarre un émulateur Android local avant de lancer les tests.
# Usage : bash scripts/start-android.sh [nom_avd]
# Nécessite $ANDROID_HOME configuré et un AVD déjà créé
# (via Android Studio > Device Manager, ou `avdmanager create avd ...`).

set -euo pipefail

AVD_NAME="${1:-${MW_AVD_NAME:-}}"

if [ -z "$AVD_NAME" ]; then
  echo "Aucun AVD précisé. AVD disponibles :"
  "$ANDROID_HOME/emulator/emulator" -list-avds
  echo ""
  echo "Usage: bash scripts/start-android.sh <nom_avd>"
  exit 1
fi

echo "Démarrage de l'émulateur '$AVD_NAME'..."
nohup "$ANDROID_HOME/emulator/emulator" -avd "$AVD_NAME" \
  -no-snapshot -netdelay none -netspeed full \
  > /tmp/emulator.log 2>&1 &

echo "Attente du boot complet..."
"$ANDROID_HOME/platform-tools/adb" wait-for-device shell \
  'while [[ -z $(getprop sys.boot_completed | tr -d "\r") ]]; do sleep 1; done'

echo "Émulateur prêt :"
"$ANDROID_HOME/platform-tools/adb" devices
