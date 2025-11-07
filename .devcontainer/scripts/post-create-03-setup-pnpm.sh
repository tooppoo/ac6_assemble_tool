#!/bin/bash
set -euo pipefail

mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global

for shell_rc in ~/.bashrc ~/.zshrc ~/.profile; do
  echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> "$shell_rc"
done
source ~/.profile

PNPM_VERSION=$(node -p "require('./package.json').packageManager.split('@')[1]")

npm i -g "pnpm@${PNPM_VERSION}"
yes | pnpm install --frozen-lockfile
