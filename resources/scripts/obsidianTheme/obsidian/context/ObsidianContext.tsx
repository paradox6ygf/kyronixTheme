// =============================================================================
// obsidianTheme — React Context
// Provides theme state, user config, and customizer controls
// =============================================================================

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useRef,
} from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

export type ThemeMode = 'dark' | 'light' | 'system';
export type AnimationLevel = 'off' | 'low' | 'medium' | 'high';
export type DensityMode = 'compact' | 'default' | 'comfortable';

export interface ObsidianColorConfig {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    sidebar?: string;
    navbar?: string;
    text?: string;
    border?: string;
    success?: string;
    warning?: string;
    danger?: string;
    info?: string;
}

export interface ObsidianTypographyConfig {
    fontFamily?: string;
    headingFont?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
}

export interface ObsidianLayoutConfig {
    sidebarWidth?: string;
    navbarHeight?: string;
    contentMaxWidth?: string;
    cardRadius?: string;
    buttonRadius?: string;
    inputRadius?: string;
}

export interface ObsidianBrandingConfig {
    panelName?: string;
    logoText?: string;
    faviconUrl?: string;
    logoUrl?: string;
    loginLogoUrl?: string;
    loginBackground?: string;
    footerText?: string;
    supportUrl?: string;
    documentationUrl?: string;
    discordUrl?: string;
    websiteUrl?: string;
}

export interface ObsidianConfig {
    version: string;
    mode: ThemeMode;
    animation: AnimationLevel;
    density: DensityMode;
    colors: ObsidianColorConfig;
    typography: ObsidianTypographyConfig;
    layout: ObsidianLayoutConfig;
    branding: ObsidianBrandingConfig;
    customCSS?: string;
}

export interface ObsidianContextValue {
    config: ObsidianConfig;
    resolvedMode: 'dark' | 'light';
    isCustomizerOpen: boolean;
    isSidebarOpen: boolean;
    updateConfig: (patch: Partial<ObsidianConfig>) => void;
    updateColors: (patch: ObsidianColorConfig) => void;
    updateBranding: (patch: ObsidianBrandingConfig) => void;
    resetConfig: () => void;
    exportConfig: () => string;
    importConfig: (json: string) => boolean;
    setCustomizerOpen: (open: boolean) => void;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
}

// ── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: ObsidianConfig = {
    version: '1.0.0',
    mode: 'dark',
    animation: 'medium',
    density: 'default',
    colors: {},
    typography: {},
    layout: {},
    branding: {
        panelName: 'obsidianTheme',
    },
};

const STORAGE_KEY = 'obsidian:config';

// ── Context ───────────────────────────────────────────────────────────────────

const ObsidianContext = createContext<ObsidianContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export const ObsidianProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<ObsidianConfig>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as Partial<ObsidianConfig>;
                return { ...DEFAULT_CONFIG, ...parsed };
            }
        } catch {
            // Storage unavailable or corrupt — use defaults
        }
        return { ...DEFAULT_CONFIG };
    });

    const [resolvedMode, setResolvedMode] = useState<'dark' | 'light'>('dark');
    const [isCustomizerOpen, setCustomizerOpen] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const applyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Resolve system color scheme
    useEffect(() => {
        const resolve = () => {
            if (config.mode === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setResolvedMode(prefersDark ? 'dark' : 'light');
            } else {
                setResolvedMode(config.mode);
            }
        };

        resolve();

        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        mq.addEventListener('change', resolve);
        return () => mq.removeEventListener('change', resolve);
    }, [config.mode]);

    // Apply tokens to DOM
    useEffect(() => {
        const root = document.documentElement;

        // Theme mode
        root.setAttribute('data-obsidian-theme', resolvedMode);
        root.setAttribute('data-obsidian-animation', config.animation);
        root.setAttribute('data-obsidian-density', config.density);

        // Custom colors → CSS variables
        const colorMap: Record<string, string | undefined> = {
            '--obsidian-primary':    config.colors.primary,
            '--obsidian-secondary':  config.colors.secondary,
            '--obsidian-accent':     config.colors.accent,
            '--obsidian-background': config.colors.background,
            '--obsidian-surface':    config.colors.surface,
            '--obsidian-sidebar':    config.colors.sidebar,
            '--obsidian-navbar':     config.colors.navbar,
            '--obsidian-text':       config.colors.text,
            '--obsidian-border':     config.colors.border,
            '--obsidian-success':    config.colors.success,
            '--obsidian-warning':    config.colors.warning,
            '--obsidian-danger':     config.colors.danger,
            '--obsidian-info':       config.colors.info,
        };

        for (const [prop, value] of Object.entries(colorMap)) {
            if (value) {
                root.style.setProperty(prop, value);
            } else {
                root.style.removeProperty(prop);
            }
        }

        // Layout
        if (config.layout.sidebarWidth) {
            root.style.setProperty('--obsidian-sidebar-width', config.layout.sidebarWidth);
        }
        if (config.layout.cardRadius) {
            root.style.setProperty('--obsidian-card-radius', config.layout.cardRadius);
        }

        // Typography
        if (config.typography.fontFamily) {
            root.style.setProperty('--obsidian-font-sans', config.typography.fontFamily);
        }

        // Custom CSS injection
        const existingStyle = document.getElementById('obsidian-custom-css');
        if (config.customCSS) {
            const style = existingStyle ?? document.createElement('style');
            style.id = 'obsidian-custom-css';
            style.textContent = config.customCSS;
            if (!existingStyle) document.head.appendChild(style);
        } else if (existingStyle) {
            existingStyle.remove();
        }

        // Branding: panel title
        if (config.branding.panelName) {
            document.title = config.branding.panelName;
        }

        // Favicon
        if (config.branding.faviconUrl) {
            const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
                ?? (() => {
                    const l = document.createElement('link');
                    l.rel = 'icon';
                    document.head.appendChild(l);
                    return l;
                })();
            link.href = config.branding.faviconUrl;
        }

    }, [config, resolvedMode]);

    // Persist config
    useEffect(() => {
        if (applyTimeoutRef.current) clearTimeout(applyTimeoutRef.current);
        applyTimeoutRef.current = setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
            } catch {
                // Storage full or unavailable
            }
        }, 500);
    }, [config]);

    const updateConfig = useCallback((patch: Partial<ObsidianConfig>) => {
        setConfig(prev => ({ ...prev, ...patch }));
    }, []);

    const updateColors = useCallback((patch: ObsidianColorConfig) => {
        setConfig(prev => ({
            ...prev,
            colors: { ...prev.colors, ...patch },
        }));
    }, []);

    const updateBranding = useCallback((patch: ObsidianBrandingConfig) => {
        setConfig(prev => ({
            ...prev,
            branding: { ...prev.branding, ...patch },
        }));
    }, []);

    const resetConfig = useCallback(() => {
        setConfig({ ...DEFAULT_CONFIG });
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const exportConfig = useCallback((): string => {
        // Never export sensitive fields
        const safe = { ...config };
        return JSON.stringify(safe, null, 2);
    }, [config]);

    const importConfig = useCallback((json: string): boolean => {
        try {
            const parsed = JSON.parse(json) as Partial<ObsidianConfig>;

            // Basic validation
            if (typeof parsed !== 'object' || Array.isArray(parsed)) return false;

            // Security: reject any function values
            const hasFunction = JSON.stringify(parsed).includes('function');
            if (hasFunction) return false;

            // Reject unsafe CSS
            if (parsed.customCSS && /(<script|javascript:|expression\()/.test(parsed.customCSS)) {
                return false;
            }

            setConfig(prev => ({ ...prev, ...parsed }));
            return true;
        } catch {
            return false;
        }
    }, []);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const value: ObsidianContextValue = {
        config,
        resolvedMode,
        isCustomizerOpen,
        isSidebarOpen,
        updateConfig,
        updateColors,
        updateBranding,
        resetConfig,
        exportConfig,
        importConfig,
        setCustomizerOpen,
        setSidebarOpen,
        toggleSidebar,
    };

    return (
        <ObsidianContext.Provider value={value}>
            {children}
        </ObsidianContext.Provider>
    );
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useObsidian = (): ObsidianContextValue => {
    const ctx = useContext(ObsidianContext);
    if (!ctx) {
        throw new Error('useObsidian must be used within a ObsidianProvider');
    }
    return ctx;
};

export default ObsidianContext;
