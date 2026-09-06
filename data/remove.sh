#!/usr/bin/env bash
#
# obsidianTheme — Blueprint custom removal script (runs from panel root).
#
set -u

echo "obsidiantheme: removing panel patches..."

BLADE_FILE="resources/views/templates/wrapper.blade.php"
if [ ! -f "$BLADE_FILE" ]; then
    BLADE_FILE="$(grep -rl '<html' resources/views/ 2>/dev/null | head -1)"
fi

if [ -f "$BLADE_FILE" ]; then
    sed -i 's| data-obsidian-theme="[^"]*"||g; s| data-obsidian-animation="[^"]*"||g; s| data-obsidian-density="[^"]*"||g' "$BLADE_FILE"
    sed -i '/<!-- obsidianTheme Bootstrap -->/,/<!-- \/obsidianTheme Bootstrap -->/d' "$BLADE_FILE"
    echo "obsidiantheme: cleaned $BLADE_FILE."
fi

echo "obsidiantheme: removal complete."
exit 0