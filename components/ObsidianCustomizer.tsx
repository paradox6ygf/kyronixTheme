/**
 * obsidianTheme — Customizer page (admin-only, Nebula-style).
 * Registered by Blueprint as an account route (/customizer, adminOnly).
 */
import React, { useEffect, useState } from 'react';
import './theme.css';
import {
    applyConfig,
    COLOR_LABELS,
    COLOR_TOKENS,
    ColorKey,
    DEFAULT_CONFIG,
    ObsidianConfig,
    loadConfig,
    resetConfig,
    saveConfig,
    ThemeMode,
    AnimationLevel,
    DensityMode,
} from './obsidianConfig';

const GROUPS: { title: string; keys: ColorKey[] }[] = [
    { title: 'Core', keys: ['primary', 'secondary', 'accent'] },
    { title: 'Surfaces', keys: ['background', 'surface', 'sidebar', 'navbar', 'modal', 'tooltip'] },
    { title: 'Content', keys: ['text', 'mutedText', 'border', 'scrollbar'] },
    { title: 'Inputs & Buttons', keys: ['button', 'buttonHover', 'input', 'inputFocus'] },
    { title: 'Status', keys: ['success', 'warning', 'danger', 'info'] },
    { title: 'Code & Console', keys: ['console', 'code'] },
];

export const ObsidianCustomizer: React.FC = () => {
    const [config, setConfig] = useState<ObsidianConfig>(() => loadConfig());

    useEffect(() => {
        document.title = 'Obsidian Theme | Panel';
        applyConfig(config);
    }, []);

    const update = (next: Partial<ObsidianConfig>) => {
        const merged = { ...config, ...next, colors: { ...config.colors } };
        setConfig(merged);
        saveConfig(merged);
        applyConfig(merged);
    };

    const setColor = (key: ColorKey, value: string) => {
        const colors = { ...config.colors, [key]: value };
        const merged = { ...config, colors };
        setConfig(merged);
        saveConfig(merged);
        applyConfig(merged);
    };

    const clearColor = (key: ColorKey) => {
        const colors = { ...config.colors };
        delete colors[key];
        const merged = { ...config, colors };
        setConfig(merged);
        saveConfig(merged);
        applyConfig(merged);
    };

    const handleReset = () => {
        const fresh = resetConfig();
        setConfig(fresh);
        applyConfig(fresh);
    };

    const exportJson = () => JSON.stringify(config, null, 2);

    const importJson = () => {
        const input = document.createElement('textarea');
        input.value = exportJson();
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('paste');
        try {
            const parsed = JSON.parse(input.value) as ObsidianConfig;
            const merged = { ...DEFAULT_CONFIG, ...parsed, colors: { ...(parsed.colors || {}) } };
            setConfig(merged);
            saveConfig(merged);
            applyConfig(merged);
        } catch {
            alert('Invalid configuration JSON.');
        }
        document.body.removeChild(input);
    };

    const select = (label: string, value: string, options: string[], onChange: (v: string) => void) => (
        <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--obsidian-text-muted, #888)', marginBottom: '6px' }}>{label}</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {options.map((o) => (
                    <button
                        key={o}
                        onClick={() => onChange(o)}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '999px',
                            border: value === o ? '1px solid var(--obsidian-primary, #7c5cff)' : '1px solid var(--obsidian-border, #333)',
                            background: value === o ? 'var(--obsidian-primary, #7c5cff)' : 'transparent',
                            color: value === o ? '#fff' : 'var(--obsidian-text, #eee)',
                            cursor: 'pointer',
                            fontSize: '12px',
                        }}
                    >
                        {o}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div style={{ color: 'var(--obsidian-text, #eee)', maxWidth: '860px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '4px' }}>Obsidian Theme Customizer</h1>
            <p style={{ color: 'var(--obsidian-text-muted, #888)', marginBottom: '20px', fontSize: '13px' }}>
                Admin-only live theme editor. Changes apply instantly and are saved per browser.
            </p>

            {select('Appearance', config.mode, ['dark', 'light', 'system'], (v) => update({ mode: v as ThemeMode }))}
            {select('Animations', config.animation, ['off', 'low', 'medium', 'high'], (v) => update({ animation: v as AnimationLevel }))}
            {select('Density', config.density, ['compact', 'default', 'comfortable'], (v) => update({ density: v as DensityMode }))}

            <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--obsidian-text-muted, #888)', marginBottom: '6px' }}>
                    Border radius ({config.radius})
                </label>
                <input
                    type="range"
                    min={0}
                    max={24}
                    value={parseInt(config.radius || '0.75rem', 10) || 0}
                    onChange={(e) => update({ radius: e.target.value + 'px' })}
                    style={{ width: '100%', accentColor: 'var(--obsidian-primary, #7c5cff)' }}
                />
            </div>

            {GROUPS.map((group) => (
                <div key={group.title} style={{ marginBottom: '18px' }}>
                    <h2 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--obsidian-text-muted, #888)', marginBottom: '10px' }}>
                        {group.title}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                        {group.keys.map((key) => (
                            <div
                                key={key}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '8px 10px',
                                    border: '1px solid var(--obsidian-border, #333)',
                                    borderRadius: 'var(--obsidian-radius, 0.75rem)',
                                    background: 'var(--obsidian-surface, rgba(255,255,255,0.03))',
                                }}
                            >
                                <input
                                    type="color"
                                    value={(config.colors[key] as string) || '#000000'}
                                    onChange={(e) => setColor(key, e.target.value)}
                                    style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                                    title={COLOR_TOKENS[key]}
                                />
                                <span style={{ fontSize: '12px', flex: 1 }}>{COLOR_LABELS[key]}</span>
                                {config.colors[key] && (
                                    <button
                                        onClick={() => clearColor(key)}
                                        title="Reset to theme default"
                                        style={{ background: 'none', border: 'none', color: 'var(--obsidian-text-muted, #888)', cursor: 'pointer', fontSize: '12px' }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '24px' }}>
                <button onClick={handleReset} style={{ padding: '10px 18px', borderRadius: 'var(--obsidian-radius, 0.75rem)', border: '1px solid var(--obsidian-danger, #ff5c5c)', background: 'transparent', color: 'var(--obsidian-danger, #ff5c5c)', cursor: 'pointer' }}>
                    Reset to defaults
                </button>
                <button onClick={() => navigator.clipboard.writeText(exportJson()).then(() => alert('Configuration copied to clipboard.'))} style={{ padding: '10px 18px', borderRadius: 'var(--obsidian-radius, 0.75rem)', border: '1px solid var(--obsidian-border, #333)', background: 'transparent', color: 'var(--obsidian-text, #eee)', cursor: 'pointer' }}>
                    Export (copy JSON)
                </button>
                <button onClick={importJson} style={{ padding: '10px 18px', borderRadius: 'var(--obsidian-radius, 0.75rem)', border: '1px solid var(--obsidian-border, #333)', background: 'transparent', color: 'var(--obsidian-text, #eee)', cursor: 'pointer' }}>
                    Import (paste JSON)
                </button>
            </div>
        </div>
    );
};

export default ObsidianCustomizer;