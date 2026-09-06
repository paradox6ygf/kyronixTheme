/**
 * obsidianTheme — shared runtime theme configuration (Theme Studio engine).
 * Used by the global bootstrap component and the customizer page.
 *
 * Everything maps to CSS custom properties consumed by theme.css, so
 * applying a config is pure variable assignment — fast and side-effect free.
 */

export type ThemeMode = 'dark' | 'light' | 'system';
export type AnimationLevel = 'off' | 'low' | 'medium' | 'high';
export type DensityMode = 'compact' | 'default' | 'comfortable';
export type PresetId = 'core' | 'slate' | 'aurora' | 'ember' | 'nightfall' | 'pebble' | 'marine' | 'violet';
export type Side = 'left' | 'right' | 'hidden';
export type CardLayout = 'compact' | 'standard' | 'dashboard';
export type ShadowLevel = 'none' | 'subtle' | 'medium';
export type StatusKey = 'online' | 'offline' | 'starting' | 'stopping' | 'installing' | 'suspended';

export interface ObsidianConfig {
    preset: PresetId;
    mode: ThemeMode;
    animation: AnimationLevel;
    density: DensityMode;
    radius: string;
    layout: {
        sidebar: Side;
        serverNav: Side | 'top';
        resources: 'top' | 'right' | 'left' | 'belowConsole' | 'aboveConsole';
        actions: 'topRight' | 'topLeft' | 'belowName' | 'aboveConsole';
        console: 'fullWidth' | 'center' | 'left' | 'right';
        charts: '1' | '2' | '3' | 'auto';
        serverCard: CardLayout;
    };
    typography: {
        scale: string; headingScale: string; navSize: string; monoSize: string;
        lineHeight: string; letterSpacing: string; weightHeadings: string;
    };
    spacing: {
        page: string; cardGap: string; sectionGap: string;
        navItem: string; consolePad: string; tablePad: string;
    };
    borders: {
        width: string; cardRadius: string; buttonRadius: string;
        inputRadius: string; modalRadius: string;
    };
    shadows: ShadowLevel;
    buttons: { height: string; weight: string; padX: string };
    console: { height: string; fontSize: string; lineHeight: string };
    icons: { size: string; spacing: string; opacity: string };
    colors: Partial<Record<ColorKey, string>>;
    statusColors: Partial<Record<StatusKey, string>>;
}

export type ColorKey =
    | 'primary' | 'secondary' | 'accent' | 'background' | 'surface'
    | 'sidebar' | 'navbar' | 'text' | 'mutedText' | 'border'
    | 'success' | 'warning' | 'danger' | 'info'
    | 'button' | 'buttonHover' | 'input' | 'inputFocus'
    | 'console' | 'code' | 'scrollbar' | 'modal' | 'tooltip';

export const COLOR_TOKENS: Record<ColorKey, string> = {
    primary: '--obsidian-primary', secondary: '--obsidian-secondary',
    accent: '--obsidian-accent', background: '--obsidian-background',
    surface: '--obsidian-surface', sidebar: '--obsidian-sidebar',
    navbar: '--obsidian-navbar', text: '--obsidian-text',
    mutedText: '--obsidian-text-muted', border: '--obsidian-border',
    success: '--obsidian-success', warning: '--obsidian-warning',
    danger: '--obsidian-danger', info: '--obsidian-info',
    button: '--obsidian-button-bg', buttonHover: '--obsidian-button-hover',
    input: '--obsidian-input-bg', inputFocus: '--obsidian-input-focus',
    console: '--obsidian-console-bg', code: '--obsidian-code-bg',
    scrollbar: '--obsidian-scrollbar', modal: '--obsidian-modal-bg',
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

export const STATUS_TOKENS: Record<StatusKey, string> = {
    online: '--obsidian-status-online', offline: '--obsidian-status-offline',
    starting: '--obsidian-status-starting', stopping: '--obsidian-status-stopping',
    installing: '--obsidian-status-installing', suspended: '--obsidian-status-suspended',
};

export const STATUS_LABELS: Record<StatusKey, string> = {
    online: 'Online', offline: 'Offline', starting: 'Starting',
    stopping: 'Stopping', installing: 'Installing', suspended: 'Suspended',
};

const STORAGE_KEY = 'obsidian:config';

/* ------------------------------------------------------------------ */
/*  PRESETS — three complete visual systems                            */
/* ------------------------------------------------------------------ */

export const PRESETS: Record<PresetId, { name: string; tagline: string; config: ObsidianConfig }> = {
    core: {
        name: 'Obsidian Core',
        tagline: 'Deep graphite surfaces, compact navigation, restrained accents.',
        config: {
            preset: 'core', mode: 'dark', animation: 'medium', density: 'default',
            radius: '0.5rem',
            layout: { sidebar: 'left', serverNav: 'left', resources: 'right', actions: 'topRight', console: 'fullWidth', charts: '2', serverCard: 'standard' },
            typography: { scale: '0.9375rem', headingScale: '1.3rem', navSize: '0.85rem', monoSize: '0.8125rem', lineHeight: '1.55', letterSpacing: '0', weightHeadings: '600' },
            spacing: { page: '1.5rem', cardGap: '1rem', sectionGap: '1.5rem', navItem: '2.5rem', consolePad: '0.75rem', tablePad: '0.625rem' },
            borders: { width: '1px', cardRadius: '0.5rem', buttonRadius: '0.375rem', inputRadius: '0.375rem', modalRadius: '0.75rem' },
            shadows: 'subtle',
            buttons: { height: '2.25rem', weight: '500', padX: '0.875rem' },
            console: { height: '26rem', fontSize: '0.8125rem', lineHeight: '1.5' },
            icons: { size: '1rem', spacing: '0.625rem', opacity: '0.85' },
            colors: {
                primary: '#9db95c', secondary: '#6b7f4b', accent: '#b5a642',
                background: '#101210', surface: '#191b18', sidebar: '#141614',
                navbar: '#141614', text: '#e8eae4', mutedText: '#8f958a',
                border: '#2a2d28', success: '#7ba05b', warning: '#c9a227',
                danger: '#b3543f', info: '#5f8aa8', button: '#232622',
                buttonHover: '#2d312b', input: '#1d201c', inputFocus: '#252922',
                console: '#0c0e0c', code: '#1a1d19', scrollbar: '#3a3e37',
                modal: '#191b18', tooltip: '#22251f',
            },
            statusColors: {
                online: '#7ba05b', offline: '#b3543f', starting: '#c9a227',
                stopping: '#c07a3a', installing: '#5f8aa8', suspended: '#8a6d3b',
            },
        },
    },

    slate: {
        name: 'Obsidian Slate',
        tagline: 'Cool slate panels, strong separation, airy spacing.',
        config: {
            preset: 'slate', mode: 'dark', animation: 'low', density: 'comfortable',
            radius: '0.75rem',
            layout: { sidebar: 'left', serverNav: 'top', resources: 'top', actions: 'topLeft', console: 'center', charts: '3', serverCard: 'dashboard' },
            typography: { scale: '0.9375rem', headingScale: '1.45rem', navSize: '0.875rem', monoSize: '0.8125rem', lineHeight: '1.65', letterSpacing: '0.01em', weightHeadings: '650' },
            spacing: { page: '2rem', cardGap: '1.25rem', sectionGap: '2rem', navItem: '2.75rem', consolePad: '1rem', tablePad: '0.75rem' },
            borders: { width: '1px', cardRadius: '0.75rem', buttonRadius: '0.5rem', inputRadius: '0.5rem', modalRadius: '1rem' },
            shadows: 'medium',
            buttons: { height: '2.5rem', weight: '600', padX: '1.125rem' },
            console: { height: '30rem', fontSize: '0.8125rem', lineHeight: '1.6' },
            icons: { size: '1.125rem', spacing: '0.75rem', opacity: '0.9' },
            colors: {
                primary: '#8fae6f', secondary: '#5d7350', accent: '#7ba7b5',
                background: '#0e1114', surface: '#171c21', sidebar: '#12161a',
                navbar: '#12161a', text: '#e6eaee', mutedText: '#8792a0',
                border: '#28303a', success: '#77a366', warning: '#cfa63f',
                danger: '#bf5b52', info: '#6a9cc0', button: '#20262c',
                buttonHover: '#29303a', input: '#181d23', inputFocus: '#1f262e',
                console: '#0a0d10', code: '#151a20', scrollbar: '#39424e',
                modal: '#171c21', tooltip: '#1f252b',
            },
            statusColors: {
                online: '#77a366', offline: '#bf5b52', starting: '#cfa63f',
                stopping: '#c07a3a', installing: '#6a9cc0', suspended: '#96702f',
            },
        },
    },

/*__AURORA__*/
    aurora: {
        name: 'Obsidian Aurora',
        tagline: 'Muted teals and violets, soft geometry, editorial typography.',
        config: {
            preset: 'aurora', mode: 'dark', animation: 'medium', density: 'default',
            radius: '0.375rem',
            layout: { sidebar: 'right', serverNav: 'left', resources: 'belowConsole', actions: 'belowName', console: 'left', charts: 'auto', serverCard: 'compact' },
            typography: { scale: '0.9rem', headingScale: '1.25rem', navSize: '0.8125rem', monoSize: '0.78125rem', lineHeight: '1.6', letterSpacing: '0.015em', weightHeadings: '550' },
            spacing: { page: '1.75rem', cardGap: '1.125rem', sectionGap: '1.75rem', navItem: '2.625rem', consolePad: '0.875rem', tablePad: '0.6875rem' },
            borders: { width: '1px', cardRadius: '0.375rem', buttonRadius: '0.25rem', inputRadius: '0.25rem', modalRadius: '0.5rem' },
            shadows: 'subtle',
            buttons: { height: '2.375rem', weight: '550', padX: '1rem' },
            console: { height: '28rem', fontSize: '0.78125rem', lineHeight: '1.55' },
            icons: { size: '1rem', spacing: '0.5625rem', opacity: '0.8' },
            colors: {
                primary: '#6f9e9a', secondary: '#4e6e75', accent: '#9a86b8',
                background: '#0d1011', surface: '#15191b', sidebar: '#111416',
                navbar: '#111416', text: '#e4e9e9', mutedText: '#849394',
                border: '#26302f', success: '#6da284', warning: '#c8a44a',
                danger: '#b85a55', info: '#7396c0', button: '#1c2224',
                buttonHover: '#252c2f', input: '#161b1d', inputFocus: '#1c2225',
                console: '#0a0d0d', code: '#141919', scrollbar: '#36403f',
                modal: '#15191b', tooltip: '#1d2325',
            },
            statusColors: {
                online: '#6da284', offline: '#b85a55', starting: '#c8a44a',
                stopping: '#bd7a3e', installing: '#7396c0', suspended: '#8f6c30',
            },
        },
    },
ember: {
        name: 'Obsidian Ember',
        tagline: 'Warm bronze embers, high energy, bold pulsing rhythm.',
        config: {
            preset: 'ember', mode: 'dark', animation: 'high', density: 'compact',
            radius: '0.25rem',
            layout: { sidebar: 'left', serverNav: 'top', resources: 'left', actions: 'aboveConsole', console: 'fullWidth', charts: '1', serverCard: 'compact' },
            typography: { scale: '0.9rem', headingScale: '1.35rem', navSize: '0.8125rem', monoSize: '0.8125rem', lineHeight: '1.5', letterSpacing: '0.015em', weightHeadings: '700' },
            spacing: { page: '1.25rem', cardGap: '0.875rem', sectionGap: '1.25rem', navItem: '2.25rem', consolePad: '0.625rem', tablePad: '0.5rem' },
            borders: { width: '1px', cardRadius: '0.25rem', buttonRadius: '0.25rem', inputRadius: '0.25rem', modalRadius: '0.375rem' },
            shadows: 'medium',
            buttons: { height: '2.5rem', weight: '700', padX: '1rem' },
            console: { height: '28rem', fontSize: '0.8125rem', lineHeight: '1.5' },
            icons: { size: '1.125rem', spacing: '0.75rem', opacity: '0.95' },
            colors: {
                primary: '#d0893a', secondary: '#b26a3a', accent: '#e0a44f',
                background: '#15100c', surface: '#1c1510', sidebar: '#180f0a',
                navbar: '#1a120c', text: '#f3e9dc', mutedText: '#a89683',
                border: '#3a2c1e', success: '#b98a4a', warning: '#e0a03f',
                danger: '#c0503f', info: '#a07c50', button: '#2a1f14',
                buttonHover: '#3a2c1c', input: '#201812', inputFocus: '#2a2018',
                console: '#0f0a06', code: '#1c1610', scrollbar: '#4a3824',
                modal: '#1c1510', tooltip: '#2a221a',
            },
            statusColors: {
                online: '#b98a4a', offline: '#c0503f', starting: '#e0a03f',
                stopping: '#c07a3a', installing: '#a07c50', suspended: '#6b4f30',
            },
        },
    },

    nightfall: {
        name: 'Obsidian Nightfall',
        tagline: 'Deep navy quietude, minimal motion, focused calm.',
        config: {
            preset: 'nightfall', mode: 'dark', animation: 'low', density: 'comfortable',
            radius: '0.75rem',
            layout: { sidebar: 'hidden', serverNav: 'top', resources: 'right', actions: 'belowName', console: 'center', charts: '3', serverCard: 'dashboard' },
            typography: { scale: '0.9375rem', headingScale: '1.5rem', navSize: '0.875rem', monoSize: '0.84375rem', lineHeight: '1.7', letterSpacing: '0.02em', weightHeadings: '500' },
            spacing: { page: '2.25rem', cardGap: '1.5rem', sectionGap: '2.25rem', navItem: '3rem', consolePad: '1.25rem', tablePad: '0.875rem' },
            borders: { width: '1px', cardRadius: '0.75rem', buttonRadius: '0.625rem', inputRadius: '0.625rem', modalRadius: '1.25rem' },
            shadows: 'subtle',
            buttons: { height: '2.375rem', weight: '500', padX: '1.125rem' },
            console: { height: '30rem', fontSize: '0.84375rem', lineHeight: '1.65' },
            icons: { size: '1rem', spacing: '0.6875rem', opacity: '0.75' },
            colors: {
                primary: '#6f8fbf', secondary: '#5b6b9e', accent: '#93a7d6',
                background: '#0a0e16', surface: '#111827', sidebar: '#0d1220',
                navbar: '#0e1424', text: '#e2e8f0', mutedText: '#8a96ad',
                border: '#1f2a3f', success: '#7ba0a8', warning: '#c0a04f',
                danger: '#c0605a', info: '#6f9fcf', button: '#182236',
                buttonHover: '#223050', input: '#141c2e', inputFocus: '#1a2438',
                console: '#070b12', code: '#111827', scrollbar: '#2a3650',
                modal: '#111827', tooltip: '#1c2740',
            },
            statusColors: {
                online: '#7ba0a8', offline: '#c0605a', starting: '#c0a04f',
                stopping: '#ba7a40', installing: '#6f9fcf', suspended: '#5a6a80',
            },
        },
    },
pebble: {
        name: 'Obsidian Pebble',
        tagline: 'Warm stone neutrals, generous spacing, soft rounding.',
        config: {
            preset: 'pebble', mode: 'dark', animation: 'medium', density: 'comfortable',
            radius: '0.875rem',
            layout: { sidebar: 'left', serverNav: 'left', resources: 'aboveConsole', actions: 'topRight', console: 'fullWidth', charts: '2', serverCard: 'standard' },
            typography: { scale: '0.9375rem', headingScale: '1.4rem', navSize: '0.875rem', monoSize: '0.8125rem', lineHeight: '1.6', letterSpacing: '0', weightHeadings: '600' },
            spacing: { page: '2rem', cardGap: '1.375rem', sectionGap: '2rem', navItem: '2.75rem', consolePad: '1rem', tablePad: '0.75rem' },
            borders: { width: '1px', cardRadius: '0.875rem', buttonRadius: '0.75rem', inputRadius: '0.75rem', modalRadius: '1.5rem' },
            shadows: 'medium',
            buttons: { height: '2.5rem', weight: '600', padX: '1.25rem' },
            console: { height: '28rem', fontSize: '0.8125rem', lineHeight: '1.55' },
            icons: { size: '1.0625rem', spacing: '0.75rem', opacity: '0.88' },
            colors: {
                primary: '#a89f91', secondary: '#8e8578', accent: '#c0b7a8',
                background: '#16140f', surface: '#1e1b15', sidebar: '#191610',
                navbar: '#1a1711', text: '#ece8df', mutedText: '#a29b8e',
                border: '#322d24', success: '#9aae78', warning: '#c9a55a',
                danger: '#c0685a', info: '#7f97a8', button: '#27221a',
                buttonHover: '#352e24', input: '#211d15', inputFocus: '#2a251b',
                console: '#100e0a', code: '#1c1810', scrollbar: '#4a4234',
                modal: '#1e1b15', tooltip: '#2b2620',
            },
            statusColors: {
                online: '#9aae78', offline: '#c0685a', starting: '#c9a55a',
                stopping: '#bd8440', installing: '#7f97a8', suspended: '#6e654a',
            },
        },
    },

    marine: {
        name: 'Obsidian Marine',
        tagline: 'Cool ocean depths, crisp geometry, right-hand rhythm.',
        config: {
            preset: 'marine', mode: 'dark', animation: 'high', density: 'default',
            radius: '0.375rem',
            layout: { sidebar: 'right', serverNav: 'top', resources: 'belowConsole', actions: 'topLeft', console: 'right', charts: 'auto', serverCard: 'compact' },
            typography: { scale: '0.9062rem', headingScale: '1.2937rem', navSize: '0.8281rem', monoSize: '0.7968rem', lineHeight: '1.58', letterSpacing: '0.01em', weightHeadings: '620' },
            spacing: { page: '1.625rem', cardGap: '1.125rem', sectionGap: '1.75rem', navItem: '2.5rem', consolePad: '0.875rem', tablePad: '0.625rem' },
            borders: { width: '1px', cardRadius: '0.375rem', buttonRadius: '0.25rem', inputRadius: '0.375rem', modalRadius: '0.625rem' },
            shadows: 'subtle',
            buttons: { height: '2.375rem', weight: '600', padX: '1rem' },
            console: { height: '28rem', fontSize: '0.7968rem', lineHeight: '1.55' },
            icons: { size: '1.0625rem', spacing: '0.6875rem', opacity: '0.82' },
            colors: {
                primary: '#4f8fae', secondary: '#3f6f8e', accent: '#6fbf9f',
                background: '#0a1216', surface: '#101c22', sidebar: '#0d151a',
                navbar: '#0e1920', text: '#dfeef2', mutedText: '#8aa0aa',
                border: '#1c333c', success: '#5fae6f', warning: '#cd9f3f',
                danger: '#c05f50', info: '#6f9fcf', button: '#16242c',
                buttonHover: '#1f323c', input: '#111e25', inputFocus: '#182a33',
                console: '#060c10', code: '#101c22', scrollbar: '#2a4450',
                modal: '#101c22', tooltip: '#1a2a33',
            },
            statusColors: {
                online: '#5fae6f', offline: '#c05f50', starting: '#cd9f3f',
                stopping: '#bf803f', installing: '#6f9fcf', suspended: '#4a6a70',
            },
        },
    },
violet: {
        name: 'Obsidian Violet',
        tagline: 'Muted violet indigo, airy spacing, editorial balance.',
        config: {
            preset: 'violet', mode: 'dark', animation: 'medium', density: 'default',
            radius: '0.5rem',
            layout: { sidebar: 'left', serverNav: 'left', resources: 'right', actions: 'belowName', console: 'fullWidth', charts: '2', serverCard: 'standard' },
            typography: { scale: '0.926rem', headingScale: '1.375rem', navSize: '0.8437rem', monoSize: '0.8125rem', lineHeight: '1.62', letterSpacing: '0.012em', weightHeadings: '580' },
            spacing: { page: '1.875rem', cardGap: '1.25rem', sectionGap: '1.875rem', navItem: '2.625rem', consolePad: '0.9375rem', tablePad: '0.6875rem' },
            borders: { width: '1px', cardRadius: '0.5rem', buttonRadius: '0.375rem', inputRadius: '0.5rem', modalRadius: '0.875rem' },
            shadows: 'medium',
            buttons: { height: '2.4375rem', weight: '600', padX: '1.125rem' },
            console: { height: '29rem', fontSize: '0.8125rem', lineHeight: '1.58' },
            icons: { size: '1.0625rem', spacing: '0.75rem', opacity: '0.85' },
            colors: {
                primary: '#8f7fb0', secondary: '#6f5f9e', accent: '#a89ad6',
                background: '#0f0e16', surface: '#181722', sidebar: '#131221',
                navbar: '#141323', text: '#e8e6f0', mutedText: '#918cab',
                border: '#2a2740', success: '#7f8fbf', warning: '#cd9f4f',
                danger: '#b85f70', info: '#7f7fbf', button: '#1f1d30',
                buttonHover: '#2b2842', input: '#191825', inputFocus: '#211f34',
                console: '#0a0910', code: '#151421', scrollbar: '#3a3650',
                modal: '#181722', tooltip: '#242140',
            },
            statusColors: {
                online: '#7f8fbf', offline: '#b85f70', starting: '#cd9f4f',
                stopping: '#bf7f5f', installing: '#7f7fbf', suspended: '#5a556f',
            },
        },
    },
};

export const DEFAULT_CONFIG: ObsidianConfig = PRESETS.core.config;

/*__MERGE__*/
function clone<T>(v: T): T {
    return JSON.parse(JSON.stringify(v)) as T;
}

export function deepMerge<T>(base: T, override: Partial<T> | null | undefined): T {
    const out = clone(base) as Record<string, unknown>;
    for (const [k, v] of Object.entries(override || {})) {
        if (v !== null && typeof v === 'object' && !Array.isArray(v)
            && typeof out[k] === 'object' && out[k] !== null) {
            out[k] = deepMerge(out[k], v as Record<string, unknown>);
        } else if (v !== undefined) {
            out[k] = v;
        }
    }
    return out as T;
}

const CSS_COLOR_RE = /^(#[0-9a-fA-F]{3,8}|rgb[a]?\([\d\s,%.]+\)|hsl[a]?\([\d\s,%.°]+\)|transparent|inherit)$/;
const DIM_RE = /^-?[\d.]+(?:px|rem|em|%|vh|vw|ch)?$/;

function safeColor(v: unknown): string | null {
    return typeof v === 'string' && CSS_COLOR_RE.test(v.trim()) ? v.trim() : null;
}
function safeDim(v: unknown): string | null {
    return typeof v === 'string' && DIM_RE.test(v.trim()) ? v.trim() : null;
}
function safeEnum<T extends string>(v: unknown, allowed: readonly T[]): T | null {
    return typeof v === 'string' && (allowed as readonly string[]).includes(v) ? (v as T) : null;
}

/** Validates and repairs an untrusted (imported/stored) configuration. */
export function sanitizeConfig(input: unknown): ObsidianConfig {
    const cfg = deepMerge(DEFAULT_CONFIG, (input || {}) as Partial<ObsidianConfig>);
    const colors = cfg.colors as Record<string, unknown>;
    for (const k of Object.keys(COLOR_TOKENS)) {
        const v = safeColor(colors[k]);
        if (v) colors[k] = v; else delete colors[k];
    }
    const status = cfg.statusColors as Record<string, unknown>;
    for (const k of Object.keys(STATUS_TOKENS)) {
        const v = safeColor(status[k]);
        if (v) status[k] = v; else delete status[k];
    }
    cfg.preset = safeEnum(cfg.preset, ['core', 'slate', 'aurora', 'ember', 'nightfall', 'pebble', 'marine', 'violet'] as const) || 'core';
    cfg.mode = safeEnum(cfg.mode, ['dark', 'light', 'system'] as const) || 'dark';
    cfg.animation = safeEnum(cfg.animation, ['off', 'low', 'medium', 'high'] as const) || 'medium';
    cfg.density = safeEnum(cfg.density, ['compact', 'default', 'comfortable'] as const) || 'default';
    cfg.shadows = safeEnum(cfg.shadows, ['none', 'subtle', 'medium'] as const) || 'subtle';
    cfg.radius = safeDim(cfg.radius) || '0.5rem';
    cfg.layout.sidebar = safeEnum(cfg.layout.sidebar, ['left', 'right', 'hidden'] as const) || 'left';
    cfg.layout.serverNav = safeEnum(cfg.layout.serverNav, ['left', 'right', 'top', 'hidden'] as const) || 'left';
    cfg.layout.resources = safeEnum(cfg.layout.resources, ['top', 'right', 'left', 'belowConsole', 'aboveConsole'] as const) || 'right';
    cfg.layout.actions = safeEnum(cfg.layout.actions, ['topRight', 'topLeft', 'belowName', 'aboveConsole'] as const) || 'topRight';
    cfg.layout.console = safeEnum(cfg.layout.console, ['fullWidth', 'center', 'left', 'right'] as const) || 'fullWidth';
    cfg.layout.charts = safeEnum(cfg.layout.charts, ['1', '2', '3', 'auto'] as const) || '2';
    cfg.layout.serverCard = safeEnum(cfg.layout.serverCard, ['compact', 'standard', 'dashboard'] as const) || 'standard';
    for (const section of ['typography', 'spacing', 'buttons', 'console', 'icons'] as const) {
        const sec = cfg[section] as Record<string, unknown>;
        for (const k of Object.keys(sec)) {
            if (k === 'lineHeight' || k === 'weightHeadings' || k === 'letterSpacing') continue;
            const v = safeDim(sec[k]);
            if (v) sec[k] = v; else delete sec[k];
        }
    }
    cfg.typography.lineHeight = typeof cfg.typography.lineHeight === 'string' && /^[\d.]+$/.test(cfg.typography.lineHeight) ? cfg.typography.lineHeight : '1.55';
    cfg.typography.weightHeadings = typeof cfg.typography.weightHeadings === 'string' && /^\d{3}$/.test(cfg.typography.weightHeadings) ? cfg.typography.weightHeadings : '600';
    cfg.typography.letterSpacing = typeof cfg.typography.letterSpacing === 'string' && /^-?[\d.]+em$/.test(cfg.typography.letterSpacing) ? cfg.typography.letterSpacing : '0';
    cfg.borders.width = typeof cfg.borders.width === 'string' && /^[\d.]+px$/.test(cfg.borders.width) ? cfg.borders.width : '1px';
    for (const k of ['cardRadius', 'buttonRadius', 'inputRadius', 'modalRadius'] as const) {
        const v = safeDim(cfg.borders[k]);
        if (v) cfg.borders[k] = v;
    }
    return cfg;
}

export function loadConfig(): ObsidianConfig {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return clone(DEFAULT_CONFIG);
        return sanitizeConfig(JSON.parse(raw));
    } catch {
        return clone(DEFAULT_CONFIG);
    }
}

export function saveConfig(config: ObsidianConfig): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch { /* storage unavailable — live preview still works */ }
    applyConfig(config);
    window.dispatchEvent(new CustomEvent('obsidian:config-changed', { detail: config }));
}

/**
 * Applies the configuration to the document. Safe to call repeatedly —
 * idempotent, pure CSS-variable assignment, no DOM restructuring.
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
    root.setAttribute('data-obsidian-shadows', config.shadows || 'subtle');
    root.setAttribute('data-obsidian-preset', config.preset || 'core');
    root.setAttribute('data-obsidian-sidebar', config.layout?.sidebar || 'left');
    root.setAttribute('data-obsidian-servernav', config.layout?.serverNav || 'left');
    root.setAttribute('data-obsidian-card', config.layout?.serverCard || 'standard');
    root.setAttribute('data-obsidian-actions', config.layout?.actions || 'topRight');
    root.setAttribute('data-obsidian-resources', config.layout?.resources || 'right');
    root.setAttribute('data-obsidian-console', config.layout?.console || 'fullWidth');

    // Custom color overrides propagate to every component via the token system.
    for (const [key, cssVar] of Object.entries(COLOR_TOKENS)) {
        const value = (config.colors as Record<string, string | undefined>)[key];
        if (value) root.style.setProperty(cssVar, value);
        else root.style.removeProperty(cssVar);
    }
    for (const [key, cssVar] of Object.entries(STATUS_TOKENS)) {
        const value = (config.statusColors as Record<string, string | undefined>)[key];
        if (value) root.style.setProperty(cssVar, value);
        else root.style.removeProperty(cssVar);
    }
    const vars: Record<string, string | undefined> = {
        '--obsidian-radius': config.radius,
        '--obsidian-border-width': config.borders?.width,
        '--obsidian-card-radius': config.borders?.cardRadius,
        '--obsidian-button-radius': config.borders?.buttonRadius,
        '--obsidian-input-radius': config.borders?.inputRadius,
        '--obsidian-modal-radius': config.borders?.modalRadius,
        '--obsidian-font-size': config.typography?.scale,
        '--obsidian-heading-size': config.typography?.headingScale,
        '--obsidian-nav-size': config.typography?.navSize,
        '--obsidian-mono-size': config.typography?.monoSize,
        '--obsidian-line-height': config.typography?.lineHeight,
        '--obsidian-letter-spacing': config.typography?.letterSpacing,
        '--obsidian-heading-weight': config.typography?.weightHeadings,
        '--obsidian-page-pad': config.spacing?.page,
        '--obsidian-card-gap': config.spacing?.cardGap,
        '--obsidian-section-gap': config.spacing?.sectionGap,
        '--obsidian-nav-item-h': config.spacing?.navItem,
        '--obsidian-console-pad': config.spacing?.consolePad,
        '--obsidian-table-pad': config.spacing?.tablePad,
        '--obsidian-button-h': config.buttons?.height,
        '--obsidian-button-weight': config.buttons?.weight,
        '--obsidian-button-px': config.buttons?.padX,
        '--obsidian-console-h': config.console?.height,
        '--obsidian-console-font': config.console?.fontSize,
        '--obsidian-console-lh': config.console?.lineHeight,
        '--obsidian-icon-size': config.icons?.size,
        '--obsidian-icon-gap': config.icons?.spacing,
        '--obsidian-icon-opacity': config.icons?.opacity,
    };
    for (const [k, v] of Object.entries(vars)) {
        if (v) root.style.setProperty(k, v);
    }
}

export function resetConfig(): ObsidianConfig {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
    const fresh = clone(DEFAULT_CONFIG);
    applyConfig(fresh);
    window.dispatchEvent(new CustomEvent('obsidian:config-changed'));
    return fresh;
}