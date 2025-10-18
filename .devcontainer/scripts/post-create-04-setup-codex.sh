#!/bin/bash
set -euo pipefail

bun add -g @openai/codex

for shell_rc in ~/.bashrc ~/.zshrc ~/.profile; do
  printf '\nexport CODEX_HOME=/workspaces/ac6_assemble_tool/.codex' >> "${shell_rc}"
done
