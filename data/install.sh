#!/usr/bin/env bash
#
# obsidianTheme — Blueprint custom installation script.
# Runs as the panel web user from the panel root, BEFORE the frontend
# rebuild. Performs the panel patches Blueprint cannot do natively.
#
set -u

echo "obsidiantheme: applying panel patches..."

# -----------------------------------------------------------------------------
# 1. Purge legacy CSS import lines left behind by earlier extension versions.
#
# Older releases registered the dashboard stylesheet through conf.yml
# 'dashboard.css', which makes Blueprint append an @import line to
# extensions.css. That import is invalid mid-file (postcss warning) and is no
# longer used — the stylesheet is now bundled via webpack. Remove any leftovers
# so the build is clean.
# -----------------------------------------------------------------------------
EXT_CSS="resources/scripts/blueprint/css/extensions.css"
if [ -f "$EXT_CSS" ]; then
    if grep -q 'imported/obsidiantheme.css' "$EXT_CSS"; then
        sed -i '/imported\/obsidiantheme.css/d' "$EXT_CSS"
        echo "obsidiantheme: purged legacy import from $EXT_CSS"
    fi
fi
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

        BOOTSTRAP_SCRIPT='    <!-- obsidianTheme Bootstrap -->\n    <script>\n        (function(){\n            try {\n                var cfg = JSON.parse(localStorage.getItem("obsidian:config") || "{}");\n                var mode = cfg.mode || "dark";\n                var anim = cfg.animation || "medium";\n                var density = cfg.density || "default";\n                if (mode === "system") {\n                    mode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";\n                }\n                document.documentElement.setAttribute("data-obsidian-theme", mode);\n                document.documentElement.setAttribute("data-obsidian-animation", anim);\n                document.documentElement.setAttribute("data-obsidian-density", density);\n            } catch (e) {\n                document.documentElement.setAttribute("data-obsidian-theme", "dark");\n            }\n        })();\n    </script>\n    <!-- /obsidianTheme Bootstrap -->'
        sed -i "s|</head>|$BOOTSTRAP_SCRIPT\n</head>|g" "$BLADE_FILE"
        echo "obsidiantheme: patched $BLADE_FILE"
    else
        echo "obsidiantheme: $BLADE_FILE already patched."
    fi
else
    echo "obsidiantheme: WARNING — no Blade layout found to patch."
fi

echo "obsidiantheme: panel patches complete."
exit 0