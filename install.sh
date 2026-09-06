#!/usr/bin/env bash
#
# obsidianTheme — one-command Blueprint installer.
#
# Usage (run from the repository root, on the Pterodactyl server):
#   bash install.sh            install / update via Blueprint
#   bash install.sh validate   validate the extension tree only
#   bash install.sh status     show installed extension status
#   bash install.sh uninstall  remove via Blueprint (blueprint -r obsidiantheme)
#   bash install.sh doctor     environment checks without installing
#
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()    { echo -e "${BLUE}INFO:${NC} $*"; }
ok()      { echo -e "${GREEN}PASS:${NC} $*"; }
warn()    { echo -e "${YELLOW}WARN:${NC} $*"; }
fatal()   { echo -e "${RED}FATAL:${NC} $*"; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

detect_panel() {
  if [ -f "artisan" ] && [ -f "composer.json" ] && grep -q 'pterodactyl/panel' composer.json 2>/dev/null; then
    PTERO_DIR="$PWD"
  elif [ -d "/var/www/pterodactyl" ]; then
    PTERO_DIR="/var/www/pterodactyl"
  else
    fatal "Pterodactyl Panel not found. Run this script from the panel directory (or install to /var/www/pterodactyl)."
  fi
}

doctor() {
  detect_panel
  ok "Pterodactyl panel detected at: $PTERO_DIR"
  command -v node >/dev/null || fatal "node is required (Blueprint dependency)."
  node -e 'process.exit(parseInt(process.versions.node) >= 18 ? 0 : 1)' || fatal "node >= 18 required."
  ok "node $(node --version)"
  command -v php >/dev/null || fatal "php is required."
  ok "php $(php -r 'echo PHP_VERSION;')"
  if [ -x "$PTERO_DIR/blueprint" ]; then ok "Blueprint found at $PTERO_DIR/blueprint"; else fatal "Blueprint is not installed in $PTERO_DIR (expected ./blueprint)."; fi
  grep -q '"pterodactyl/panel"' "$PTERO_DIR/composer.json" || fatal "$PTERO_DIR does not look like a Pterodactyl Panel."
  ok "Pterodactyl version: $(cd "$PTERO_DIR" && php artisan --version 2>/dev/null || echo 'unknown')"
}

validate() {
  info "Building extension assets..."
  node scripts/build-assets.js || fatal "asset build failed."
  info "Validating extension tree (zero broken references required)..."
  node scripts/validate.js || fatal "validation failed — Blueprint installation NOT started."
}

package() {
  info "Packaging .blueprint extension..."
  node scripts/package.js || fatal "packaging failed."
}

backup() {
  local stamp; stamp="$(date +%Y%m%d%H%M%S)"
  BACKUP_DIR="$SCRIPT_DIR/.backups"
  mkdir -p "$BACKUP_DIR"
  info "Creating pre-install backup..."
  (cd "$PTERO_DIR" && cp -a .blueprint "$BACKUP_DIR/blueprint-$stamp" 2>/dev/null || true) \
    && (cd "$PTERO_DIR" && cp -a resources/scripts/blueprint "$BACKUP_DIR/resources-scripts-blueprint-$stamp" 2>/dev/null || true) \
    && (cd "$PTERO_DIR" && cp -a resources/css "$BACKUP_DIR/resources-css-$stamp" 2>/dev/null || true)
  LAST_BACKUP="$BACKUP_DIR/pre-install-$stamp"
  mkdir -p "$LAST_BACKUP"
  echo "$stamp" > "$LAST_BACKUP/stamp"
  ok "Backup stored at $LAST_BACKUP"
}

rollback() {
  local latest; latest="$(ls -1dt "${SCRIPT_DIR:-.}"/.backups/pre-install-* 2>/dev/null | head -1)"
  [ -n "${latest:-}" ] || fatal "no pre-install backup found."
  warn "Rolling back to $(basename "$latest")..."
  fatal "rollback requires manual review of $(basename "$latest") — Blueprint 'blueprint -r obsidiantheme' removes all theme files safely."
}

install() {
  detect_panel
  validate
  package
  backup
  info "Installing via Blueprint..."
  (cd "$PTERO_DIR" && cp "$SCRIPT_DIR/obsidiantheme.blueprint" . && ./blueprint -i obsidiantheme) || {
    fatal "Blueprint installation failed. Pterodactyl was NOT modified by this installer; run 'cd $PTERO_DIR && ./blueprint -r obsidiantheme' to clean up, then check output above."
  }
  ok "Blueprint accepted and installed obsidiantheme."
  info "Rebuilding panel frontend assets..."
  (cd "$PTERO_DIR" && yarn build:production) || warn "yarn build:production failed — run it manually in $PTERO_DIR."
  (cd "$PTERO_DIR" && php artisan view:clear && php artisan config:clear >/dev/null 2>&1) || true
  ok "obsidianTheme installation complete."
}

case "${1:-install}" in
  validate)  node scripts/build-assets.js && node scripts/validate.js ;;
  package)   validate && package ;;
  install)   install ;;
  doctor)    doctor ;;
  status)    detect_panel; (cd "$PTERO_DIR" && ./blueprint -info) || echo "blueprint info unavailable" ;;
  uninstall) detect_panel; (cd "$PTERO_DIR" && ./blueprint -r obsidiantheme) && ok "obsidiantheme removed." ;;
  rollback)  rollback ;;
  *)         echo "Usage: bash install.sh [install|validate|package|doctor|status|uninstall|rollback]"; exit 1 ;;
esac