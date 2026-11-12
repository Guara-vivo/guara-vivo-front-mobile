#!/usr/bin/env bash
# Lê a versão do app nos 3 lugares (package.json, app.config.js e android/app/build.gradle)
# e falha se não baterem. Grava version e version_code em $GITHUB_OUTPUT (ou no stdout).
set -euo pipefail

root="$(git rev-parse --show-toplevel)"

pkg_version=$(sed -nE 's/^[[:space:]]*"version":[[:space:]]*"([^"]+)".*/\1/p' "$root/package.json" | head -1)
cfg_version=$(sed -nE "s/^[[:space:]]*version:[[:space:]]*'([^']+)'.*/\1/p" "$root/app.config.js" | head -1)
gradle_version=$(sed -nE 's/^[[:space:]]*versionName[[:space:]]+"([^"]+)".*/\1/p' "$root/android/app/build.gradle" | head -1)
gradle_code=$(sed -nE 's/^[[:space:]]*versionCode[[:space:]]+([0-9]+).*/\1/p' "$root/android/app/build.gradle" | head -1)

echo "package.json=$pkg_version app.config.js=$cfg_version build.gradle=$gradle_version versionCode=$gradle_code" >&2

semver='^[0-9]+\.[0-9]+\.[0-9]+$'
if ! [[ "$pkg_version" =~ $semver ]]; then
  echo "::error::Versão inválida em package.json: '$pkg_version' (esperado X.Y.Z)" >&2
  exit 1
fi
if [[ "$pkg_version" != "$cfg_version" || "$pkg_version" != "$gradle_version" ]]; then
  echo "::error::Versões diferentes: package.json=$pkg_version, app.config.js=$cfg_version, build.gradle=$gradle_version" >&2
  exit 1
fi
if [[ -z "$gradle_code" ]]; then
  echo "::error::versionCode não encontrado em android/app/build.gradle" >&2
  exit 1
fi

out="${GITHUB_OUTPUT:-/dev/stdout}"
{
  echo "version=$pkg_version"
  echo "version_code=$gradle_code"
} >> "$out"
