#!/usr/bin/env bash
#
# obsidianTheme - Blueprint custom removal script (runs from panel root).
#
set -u

echo "obsidiantheme: removing panel patches..."

EXT_CSS="resources/scripts/blueprint/css/extensions.css"
if [ -f "$EXT_CSS" ]; then
    if grep -qE 'imported/(kyronix|obsidian)theme\.css' "$EXT_CSS"; then
        sed -i '\@imported/\(kyronix\|obsidian\)theme\.css@d' "$EXT_CSS"
        echo "obsidiantheme: purged legacy import from $EXT_CSS"
    fi
fi
rm -f "resources/scripts/blueprint/css/imported/kyronixtheme.css"
rm -f "resources/scripts/blueprint/css/imported/obsidiantheme.css"

BLADE_FILE="resources/views/templates/wrapper.blade.php"
if [ ! -f "$BLADE_FILE" ]; then
    BLADE_FILE="$(grep -rl '<html' resources/views/ 2>/dev/null | head -1)"
fi

if [ -f "$BLADE_FILE" ]; then
    sed -i 's| data-obsidian-theme="[^"]*"||g; s| data-kyronix-theme="[^"]*"||g; s| data-obsidian-animation="[^"]*"||g; s| data-kyronix-animation="[^"]*"||g; s| data-obsidian-density="[^"]*"||g; s| data-kyronix-density="[^"]*"||g' "$BLADE_FILE"
    sed -i '/<!-- obsidianTheme Bootstrap -->/,/<!-- \/obsidianTheme Bootstrap -->/d' "$BLADE_FILE"
    sed -i '/<!-- kyronixTheme Bootstrap -->/,/<!-- \/kyronixTheme Bootstrap -->/d' "$BLADE_FILE"
    echo "obsidiantheme: cleaned $BLADE_FILE."
fi

echo "obsidiantheme: removal complete."
exit 0