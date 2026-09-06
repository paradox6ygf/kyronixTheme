#!/usr/bin/env bash
#
# obsidianTheme - Blueprint custom installation script.
# Runs as the panel web user from the panel root, BEFORE the frontend
# rebuild. Performs the panel patches Blueprint cannot do natively.
#
set -u

echo "obsidiantheme: applying panel patches..."

# -----------------------------------------------------------------------------
# 1. Purge legacy CSS import lines left behind by earlier extension versions.
#
# Older releases registered the dashboard stylesheet through conf.yml
# dashboard.css, which makes Blueprint append an @import line to
# extensions.css. That import is invalid mid-file (postcss warning) and is no
# longer used - the stylesheet is now bundled via webpack. Remove any leftovers
# (both the old kyronixtheme and obsidiantheme variants) so the build is clean.
# -----------------------------------------------------------------------------
EXT_CSS="resources/scripts/blueprint/css/extensions.css"
if [ -f "$EXT_CSS" ]; then
    if grep -qE 'imported/(kyronix|obsidian)theme\.css' "$EXT_CSS"; then
        sed -i '\@imported/\(kyronix\|obsidian\)theme\.css@d' "$EXT_CSS"
        echo "obsidiantheme: purged legacy import from $EXT_CSS"
    fi
fi
rm -f "resources/scripts/blueprint/css/imported/kyronixtheme.css"
rm -f "resources/scripts/blueprint/css/imported/obsidiantheme.css"

# -----------------------------------------------------------------------------
# 2. Patch the Blade layout so admin pages get the theme data attributes
#    before any JavaScript runs.
# -----------------------------------------------------------------------------
BLADE_FILE="resources/views/templates/wrapper.blade.php"
if [ ! -f "$BLADE_FILE" ]; then
    BLADE_FILE="$(grep -rl '<html' resources/views/ 2>/dev/null | head -1)"
fi

if [ -f "$BLADE_FILE" ]; then
    if ! grep -q 'data-obsidian-theme' "$BLADE_FILE"; then
        sed -i 's|<html\([^>]*\)>|<html\1 data-obsidian-theme="dark" data-obsidian-animation="medium" data-obsidian-density="default">|' "$BLADE_FILE"

        # Inject the bootstrap script immediately before </head>. Written to a
        # temp file first so we never break sed with multi-line replacement text.
        BOOTSTRAP_TMP="$(mktemp)"
        cat > "$BOOTSTRAP_TMP" <<'BOOTSTRAP'
    <!-- obsidianTheme Bootstrap -->
    <script>
        (function(){
            try {
                var cfg = JSON.parse(localStorage.getItem('obsidian:config') || '{}');
                var mode = cfg.mode || 'dark';
                var anim = cfg.animation || 'medium';
                var density = cfg.density || 'default';
                if (mode === 'system') {
                    mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                document.documentElement.setAttribute('data-obsidian-theme', mode);
                document.documentElement.setAttribute('data-obsidian-animation', anim);
                document.documentElement.setAttribute('data-obsidian-density', density);
            } catch (e) {
                document.documentElement.setAttribute('data-obsidian-theme', 'dark');
            }
        })();
    </script>
    <!-- /obsidianTheme Bootstrap -->
BOOTSTRAP
        awk 'NR==FNR{boost=boost $0 "\n"; next} /<\/head>/{printf "%s",boost} {print}' "$BOOTSTRAP_TMP" "$BLADE_FILE" > "$BLADE_FILE.tmp" && mv "$BLADE_FILE.tmp" "$BLADE_FILE"
        rm -f "$BOOTSTRAP_TMP"
        echo "obsidiantheme: patched $BLADE_FILE"
    else
        echo "obsidiantheme: $BLADE_FILE already patched."
    fi
else
    echo "obsidiantheme: WARNING - no Blade layout found to patch."
fi

echo "obsidiantheme: panel patches complete."
exit 0