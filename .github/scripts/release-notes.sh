#!/usr/bin/env bash
# Uso: release-notes.sh X.Y.Z
# Imprime a seção "## [X.Y.Z]" do CHANGELOG.md (sem o título). Falha se não existir ou estiver vazia.
set -euo pipefail

version="${1:?informe a versão (X.Y.Z)}"
root="$(git rev-parse --show-toplevel)"

notes=$(awk -v v="$version" '
  $0 ~ "^## \\[" v "\\]" { found = 1; next }
  found && /^## \[/ { exit }
  found { print }
' "$root/CHANGELOG.md")

# Remove linhas em branco no começo e no fim.
notes=$(printf '%s\n' "$notes" | sed -e '/./,$!d' | sed -e ':a' -e '/^\n*$/{$d;N;ba' -e '}')

if [[ -z "${notes//[[:space:]]/}" ]]; then
  echo "::error::CHANGELOG.md não tem a seção '## [$version]' (ou ela está vazia)" >&2
  exit 1
fi

printf '%s\n' "$notes"
