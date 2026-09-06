/**
 * obsidianTheme — shared runtime theme configuration.
 * Used by both the global bootstrap component and the customizer page.
 */

export type ThemeMode = 'dark' | 'light' | 'system';
export type AnimationLevel = 'off' | 'low' | 'medium' | 'high';
export type DensityMode = 'compact' | 'default' | 'comfortable';

export interface ObsidianConfig {
    mode: ThemeMode;
    animation: AnimationLevel;
    density: DensityMode;
    radius: string;
    colors: Partial<Record<ColorKey, string>>;
}

export type ColorKey =
    | 'primary' | 'secondary' | 'accent' | 'background' | 'surface'
    | 'sidebar' | 'navbar' | 'text' | 'mutedText' | 'border'
    | 'success' | 'warning' | 'danger' | 'info'
    | 'button' | 'buttonHover' | 'input' | 'inputFocus'
    | 'console' | 'code' | 'scrollbar' | 'modal' | 'tooltip';

export const COLOR_TOKENS: Record<ColorKey, string> = {
    primary: '--obsidian-primary',
    secondary: '--obsidian-secondary',
    accent: '--obsidian-accent',
    background: '--obsidian-background',
    surface: '--obsidian-surface',
    sidebar: '--obsidian-sidebar',
    navbar: '--obsidian-navbar',
    text: '--obsidian-text',
    mutedText: '--obsidian-text-muted',
    border: '--obsidian-border',
    success: '--obsidian-success',
    warning: '--obsidian-warning',
    danger: '--obsidian-danger',
    info: '--obsidian-info',
    button: '--obsidian-button-bg',
    buttonHover: '--obsidian-button-hover',
    input: '--obsidian-input-bg',
    inputFocus: '--obsidian-input-focus',
    console: '--obsidian-console-bg',
    code: '--obsidian-code-bg',
    scrollbar: '--obsidian-scrollbar',
    modal: '--obsidian-modal-bg',
    tooltip: '--obsidian-tooltip-bg',
};

export const COLOR_LABELS: Record<ColorKey, string> = {
    primary: 'Primary', secondary: 'Secondary', accent: 'Accent',
    background: 'Background', surface: 'Surface', sidebar: 'Sidebar',
    navbar: 'Navbar', text: 'Text', mutedText: 'Muted Text', border: 'Border',
    success: 'Success', warning: 'Warning', danger: 'Danger', info: 'Info',
    button: 'Button', buttonHover: 'Button Hover', input: 'Input',
    inputFocus: 'Input Focus', console: 'Console', code: 'Code',
    scrollbar: 'Scrollbar', modal: 'Modal', tooltip: 'Tooltip',
};

const STORAGE_KEY = 'obsidian:config';

export const DEFAULT_CONFIG: ObsidianConfig = {
    mode: 'dark',
    animation: 'medium',
    density: 'default',
    radius: '0.75rem',
    colors: {},
};

export function loadConfig(): ObsidianConfig {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...DEFAULT_CONFIG };
        const parsed = JSON.parse(raw);
        return {
            ...DEFAULT_CONFIG,
            ...parsed,
            colors: { ...(parsed.colors || {}) },
        };
    } catch {
        return { ...DEFAULT_CONFIG };
    }
}

export function saveConfig(config: ObsidianConfig): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
        /* storage unavailable — live preview still works */
    }
    window.dispatchEvent(new CustomEvent('obsidian:config-changed'));
}

/**
 * Applies the configuration to the document. Safe to call repeatedly —
 * it is fully idempotent and never removes anything it did not set.
 */
export function applyConfig(config: ObsidianConfig): void {
    const root = document.documentElement;
    let mode = config.mode || 'dark';
    if (mode === 'system') {
        mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    root.setAttribute('data-obsidian-theme', mode);
    root.setAttribute('data-obsidian-animation', config.animation || 'medium');
    root.setAttribute('data-obsidian-density', config.density || 'default');

    // Custom color overrides propagate to every component via the token system.
    for (const [key, cssVar] of Object.entries(COLOR_TOKENS)) {
        const value = (config.colors as Record<string, string | undefined>)[key];
        if (value) {
            root.style.setProperty(cssVar, value);
        } else {
            root.style.removeProperty(cssVar);
        }
    }
    if (config.radius) {
        root.style.setProperty('--obsidian-radius', config.radius);
    }
}

export function resetConfig(): ObsidianConfig {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
    const root = document.documentElement;
    for (const cssVar of Object.values(COLOR_TOKENS)) {
        root.style.removeProperty(cssVar);
    }
    root.style.removeProperty('--obsidian-radius');
    window.dispatchEvent(new CustomEvent('obsidian:config-changed'));
    return { ...DEFAULT_CONFIG };
}