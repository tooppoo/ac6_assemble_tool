#!/bin/bash
set -euo pipefail

for shell_rc in ~/.bashrc ~/.zshrc ~/.profile; do
  printf '\nexport PATH="$BUN_INSTALL_BIN:$PATH"' >> "${shell_rc}"
done

export PATH="$BUN_INSTALL_BIN:$PATH"
