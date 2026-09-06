/**
 * obsidianTheme Tailwind patch.
 * Bridges Obsidian CSS custom properties into Tailwind's theme so panel
 * components can use obsidian color tokens. Loaded from tailwind.config.js:
 *
 *   try { require('./resources/scripts/obsidianTheme/tailwind/obsidian-tailwind-patch.js'); } catch(e) {}
 */
module.exports = {
    theme: {
        extend: {
            colors: {
                'obsidian-primary': 'var(--obsidian-primary)',
                'obsidian-secondary': 'var(--obsidian-secondary)',
                'obsidian-accent': 'var(--obsidian-accent)',
                'obsidian-background': 'var(--obsidian-background)',
                'obsidian-surface': 'var(--obsidian-surface)',
                'obsidian-card': 'var(--obsidian-card)',
                'obsidian-text': 'var(--obsidian-text)',
                'obsidian-muted': 'var(--obsidian-text-muted)',
                'obsidian-border': 'var(--obsidian-border)',
                'obsidian-success': 'var(--obsidian-success)',
                'obsidian-warning': 'var(--obsidian-warning)',
                'obsidian-danger': 'var(--obsidian-danger)',
                'obsidian-info': 'var(--obsidian-info)',
            },
            borderRadius: {
                obsidian: 'var(--obsidian-radius, 0.75rem)',
            },
        },
    },
};