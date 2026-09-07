/**
 * obsidianTheme — Theme Studio (admin-only).
 * Registered by Blueprint as an account route (/customizer, adminOnly).
 * Full visual theme builder: 3 complete presets, layout builder, and
 * live controls for every design token. All changes apply instantly
 * through CSS variables; nothing structural in Pterodactyl is touched.
 */
import React, { useMemo, useRef, useState } from 'react';
import './theme.css';
import {
    ObsidianConfig, PRESETS, PresetId, ColorKey, StatusKey,
    ThemeMode, AnimationLevel, DensityMode, Side, CardLayout, ShadowLevel,
    COLOR_LABELS, COLOR_TOKENS, STATUS_LABELS, STATUS_TOKENS,
    loadConfig, saveConfig, resetConfig, sanitizeConfig, deepMerge, applyConfig,
} from './obsidianConfig';
import ObsidianPreview from './ObsidianPreview';

type Section = 'presets' | 'layout' | 'colors' | 'typography' | 'console' | 'components' | 'status' | 'branding';

const SECTIONS: { id: Section; label: string }[] = [
    { id: 'presets', label: 'Prebuilt Themes' },
    { id: 'layout', label: 'Layout Builder' },
    { id: 'colors', label: 'Colors' },
    { id: 'typography', label: 'Typography & Spacing' },
    { id: 'console', label: 'Console' },
    { id: 'components', label: 'Components' },
    { id: 'status', label: 'Status Colors' },
    { id: 'branding', label: 'Import / Export' },
];

const STATUS_GROUPS: { title: string; keys: StatusKey[] }[] = [
    { title: 'Server Status', keys: ['online', 'offline', 'starting', 'stopping', 'installing', 'suspended'] },
];

/* ---------- control primitives — every control is functional ---------- */

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="obs-st-row">
            <span className="obs-st-label">{label}</span>
            <div className="obs-st-control">{children}</div>
        </div>
    );
}

function ColorRow({ label, value, fallback, onChange }: {
    label: string; value?: string; fallback: string; onChange: (v: string) => void;
}) {
    const current = value || fallback;
    return (
        <Row label={label}>
            <input
                type="color"
                className="obs-st-color"
                value={/^#[0-9a-fA-F]{6}$/.test(current) ? current : '#000000'}
                onChange={(e) => onChange(e.target.value)}
                aria-label={label}
            />
            <input
                type="text"
                className="obs-st-hex"
                value={current}
                onChange={(e) => onChange(e.target.value)}
                spellCheck={false}
                aria-label={label + ' value'}
            />
        </Row>
    );
}

function EnumRow<T extends string>({ label, value, options, onChange }: {
    label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void;
}) {
    return (
        <Row label={label}>
            <select className="obs-st-select" value={value} onChange={(e) => onChange(e.target.value as T)}>
                {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </Row>
    );
}

function DimRow({ label, value, fallback, onChange }: {
    label: string; value?: string; fallback: string; onChange: (v: string) => void;
}) {
    const cur = value || fallback;
    const num = parseFloat(cur) || 0;
    const unit = cur.replace(/^[-\d.]+/, '') || 'rem';
    return (
        <Row label={label}>
            <input
                type="range" className="obs-st-range" min={0} max={unit === 'px' ? 24 : 4} step={unit === 'px' ? 1 : 0.0625}
                value={num} onChange={(e) => onChange(`${e.target.value}${unit}`)} aria-label={label}
            />
            <span className="obs-st-dim">{cur}</span>
        </Row>
    );
}

/* ---------- preset gallery ---------- */

function PresetCard({ id, active, onPick }: { id: PresetId; active: boolean; onPick: (id: PresetId) => void }) {
    const p = PRESETS[id];
    const c = p.config.colors;
    return (
        <button
            className={`obs-st-preset${active ? ' is-active' : ''}`}
            onClick={() => onPick(id)}
            aria-pressed={active}
        >
            <span className="obs-st-preset-preview" aria-hidden>
                <span style={{ background: c.background }} className="obs-st-prev-bg">
                    <span style={{ background: c.sidebar }} className="obs-st-prev-side" />
                    <span className="obs-st-prev-main">
                        <span style={{ background: c.navbar }} className="obs-st-prev-nav" />
                        <span className="obs-st-prev-cards">
                            <span style={{ background: c.surface, borderColor: c.border }} className="obs-st-prev-card">
                                <span style={{ background: c.primary }} className="obs-st-prev-dot" />
                            </span>
                            <span style={{ background: c.surface, borderColor: c.border }} className="obs-st-prev-card">
                                <span style={{ background: PRESETS[id].config.statusColors?.online || c.success }} className="obs-st-prev-dot" />
                            </span>
                        </span>
                        <span style={{ background: c.console }} className="obs-st-prev-console" />
                    </span>
                </span>
            </span>
            <span className="obs-st-preset-name">{p.name}</span>
            <span className="obs-st-preset-tag">{p.tagline}</span>
            {active && <span className="obs-st-preset-badge">Active</span>}
        </button>
    );
}

/* ---------- import / export ---------- */

function ImportExport({ config, onImport }: { config: ObsidianConfig; onImport: (c: ObsidianConfig) => void }) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');

    const exportTheme = () => {
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'obsidian-theme.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const importFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = sanitizeConfig(JSON.parse(String(reader.result)));
                setError('');
                onImport(parsed);
            } catch {
                setError('Invalid theme file — expected exported JSON.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div>
            <p className="obs-st-hint">Export the current theme as JSON, or import a previously exported one. Imported values are validated — invalid colors and dimensions are discarded.</p>
            <div className="obs-st-btn-row">
                <button className="obs-st-btn" onClick={exportTheme}>Export Theme</button>
                <button className="obs-st-btn" onClick={() => fileRef.current?.click()}>Import Theme</button>
                <input
                    ref={fileRef} type="file" accept="application/json,.json" hidden
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) importFile(f); e.target.value = ''; }}
                />
            </div>
            {error && <p className="obs-st-error">{error}</p>}
        </div>
    );
}

/* ---------- main component ---------- */

export default function ObsidianCustomizer() {
    const [config, setConfig] = useState<ObsidianConfig>(() => loadConfig());
    const [section, setSection] = useState<Section>('presets');
    const [saved, setSaved] = useState(false);
    const history = useRef<ObsidianConfig[]>([]);
    const future = useRef<ObsidianConfig[]>([]);
    const [, forceRender] = useState(0);

    const push = (next: ObsidianConfig) => {
        history.current.push(config);
        if (history.current.length > 50) history.current.shift();
        future.current = [];
        setConfig(next);
        applyConfig(next);          // live preview across the whole panel
        setSaved(false);
    };

    const undo = () => {
        const prev = history.current.pop();
        if (!prev) return;
        future.current.push(config);
        setConfig(prev);
        applyConfig(prev);
        forceRender((n) => n + 1);
    };

    const redo = () => {
        const next = future.current.pop();
        if (!next) return;
        history.current.push(config);
        setConfig(next);
        applyConfig(next);
        forceRender((n) => n + 1);
    };

    const set = <K extends keyof ObsidianConfig>(key: K, value: ObsidianConfig[K]) =>
        push({ ...config, [key]: value });

    const setLayout = (key: keyof ObsidianConfig['layout'], value: string) =>
        push({ ...config, layout: { ...config.layout, [key]: value } });

    const setColor = (key: ColorKey, value: string) =>
        push({ ...config, colors: { ...config.colors, [key]: value } });

    const setStatus = (key: StatusKey, value: string) =>
        push({ ...config, statusColors: { ...config.statusColors, [key]: value } });

    const save = () => {
        saveConfig(config);
        setSaved(true);
    };

    const reset = () => push(resetConfig());

    const restorePreset = (id: PresetId) =>
        push({ ...deepMerge(PRESETS[id].config, { preset: id }), preset: id });

    const c = config.colors;
    const fallbacks = PRESETS[config.preset]?.config.colors || {};

    return (
        <div className="obs-st">
            <header className="obs-st-header">
                <div>
                    <h1 className="obs-st-title">Obsidian Theme Studio</h1>
                    <p className="obs-st-sub">Visual builder — every change previews instantly across the panel.</p>
                </div>
                <div className="obs-st-header-actions">
                    <button className="obs-st-btn" onClick={undo} disabled={history.current.length === 0}>Undo</button>
                    <button className="obs-st-btn" onClick={redo} disabled={future.current.length === 0}>Redo</button>
                    <button className="obs-st-btn" onClick={reset}>Reset</button>
                    <button className="obs-st-btn obs-st-btn-primary" onClick={save}>
                        {saved ? 'Saved ✓' : 'Save Changes'}
                    </button>
                </div>
            </header>

            <ObsidianPreview config={config} />

            <nav className="obs-st-tabs" role="tablist">
                {SECTIONS.map((s) => (
                    <button
                        key={s.id}
                        role="tab"
                        aria-selected={section === s.id}
                        className={`obs-st-tab${section === s.id ? ' is-active' : ''}`}
                        onClick={() => setSection(s.id)}
                    >
                        {s.label}
                    </button>
                ))}
            </nav>

            <div className="obs-st-body">
                {section === 'presets' && (
                    <section className="obs-st-panel">
                        <h2 className="obs-st-heading">Prebuilt Themes</h2>
                        <p className="obs-st-hint">
                            Pick a complete design system — layout, geometry, colors and typography all change.
                            Use Reset for a clean start from a preset.
                        </p>
                        <div className="obs-st-presets">
                            {(Object.keys(PRESETS) as PresetId[]).map((id) => (
                                <PresetCard key={id} id={id} active={config.preset === id} onPick={restorePreset} />
                            ))}
                        </div>
                        <div className="obs-st-group">
                            <Row label="Appearance">
                                <select className="obs-st-select" value={config.mode}
                                    onChange={(e) => set('mode', e.target.value as ThemeMode)} aria-label="Appearance">
                                    <option value="dark">Dark</option>
                                    <option value="light">Light</option>
                                    <option value="system">Follow system</option>
                                </select>
                            </Row>
                            <Row label="Animations">
                                <select className="obs-st-select" value={config.animation}
                                    onChange={(e) => set('animation', e.target.value as AnimationLevel)} aria-label="Animations">
                                    <option value="off">Off</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </Row>
                            <Row label="Density">
                                <select className="obs-st-select" value={config.density}
                                    onChange={(e) => set('density', e.target.value as DensityMode)} aria-label="Density">
                                    <option value="compact">Compact</option>
                                    <option value="default">Default</option>
                                    <option value="comfortable">Comfortable</option>
                                </select>
                            </Row>
                        </div>
                    </section>
                )}

                {section === 'layout' && (
                    <section className="obs-st-panel">
                        <h2 className="obs-st-heading">Layout Builder</h2>
                        <p className="obs-st-hint">Reposition major UI regions. Structural styling only — data and behavior are untouched.</p>
                        <div className="obs-st-group">
                            <Row label="Sidebar">
                                <select className="obs-st-select" value={config.layout.sidebar}
                                    onChange={(e) => setLayout('sidebar', e.target.value)} aria-label="Sidebar position">
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                    <option value="hidden">Hidden</option>
                                </select>
                            </Row>
                            <Row label="Server navigation">
                                <select className="obs-st-select" value={config.layout.serverNav}
                                    onChange={(e) => setLayout('serverNav', e.target.value)} aria-label="Server navigation position">
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                    <option value="top">Top</option>
                                    <option value="hidden">Hidden</option>
                                </select>
                            </Row>
                            <Row label="Resource cards">
                                <select className="obs-st-select" value={config.layout.resources}
                                    onChange={(e) => setLayout('resources', e.target.value)} aria-label="Resource card position">
                                    <option value="top">Top</option>
                                    <option value="right">Right</option>
                                    <option value="left">Left</option>
                                    <option value="aboveConsole">Above console</option>
                                    <option value="belowConsole">Below console</option>
                                </select>
                            </Row>
                            <Row label="Power actions">
                                <select className="obs-st-select" value={config.layout.actions}
                                    onChange={(e) => setLayout('actions', e.target.value)} aria-label="Power action position">
                                    <option value="topRight">Top right</option>
                                    <option value="topLeft">Top left</option>
                                    <option value="belowName">Below server name</option>
                                    <option value="aboveConsole">Above console</option>
                                </select>
                            </Row>
                            <Row label="Server grid columns">
                                <select className="obs-st-select" value={config.layout.serverGrid || '2'}
                                    onChange={(e) => setLayout('serverGrid', e.target.value)} aria-label="Server grid columns">
                                    <option value="1">1 column</option>
                                    <option value="2">2 columns</option>
                                    <option value="3">3 columns</option>
                                    <option value="4">4 columns</option>
                                    <option value="auto">Auto fit</option>
                                    <option value="autofill">Auto fill</option>
                                </select>
                            </Row>
                            <Row label="Card padding">
                                <select className="obs-st-select" value={config.layout.cardPad || '1.125rem'}
                                    onChange={(e) => setLayout('cardPad', e.target.value)} aria-label="Server card padding">
                                    <option value="0.75rem">Compact</option>
                                    <option value="1.125rem">Default</option>
                                    <option value="1.5rem">Spacious</option>
                                </select>
                            </Row>
                            <Row label="Card radius">
                                <select className="obs-st-select" value={config.borders?.cardRadius || '0.625rem'}
                                    onChange={(e) => push({ ...config, borders: { ...config.borders, cardRadius: e.target.value } })} aria-label="Server card radius">
                                    <option value="0px">Sharp</option>
                                    <option value="0.375rem">Soft</option>
                                    <option value="0.625rem">Default</option>
                                    <option value="0.875rem">Rounded</option>
                                    <option value="1.25rem">Pill</option>
                                </select>
                            </Row>
                            <Row label="Status indicator">
                                <select className="obs-st-select" value={config.layout.statusPos || 'top'}
                                    onChange={(e) => setLayout('statusPos', e.target.value)} aria-label="Status indicator position">
                                    <option value="top">Top accent</option>
                                    <option value="bottom">Bottom accent</option>
                                    <option value="left">Left accent</option>
                                    <option value="right">Right accent</option>
                                    <option value="inline">Inline (stock)</option>
                                    <option value="hidden">Subtle</option>
                                </select>
                            </Row>
                            <Row label="Console">
                                <select className="obs-st-select" value={config.layout.console}
                                    onChange={(e) => setLayout('console', e.target.value)} aria-label="Console position">
                                    <option value="fullWidth">Full width</option>
                                    <option value="center">Center</option>
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                </select>
                            </Row>
                            <Row label="Chart columns">
                                <select className="obs-st-select" value={config.layout.charts}
                                    onChange={(e) => setLayout('charts', e.target.value)} aria-label="Chart columns">
                                    <option value="1">1 column</option>
                                    <option value="2">2 columns</option>
                                    <option value="3">3 columns</option>
                                    <option value="auto">Auto grid</option>
                                </select>
                            </Row>
                            <Row label="Server card style">
                                <select className="obs-st-select" value={config.layout.serverCard}
                                    onChange={(e) => setLayout('serverCard', e.target.value)} aria-label="Server card layout">
                                    <option value="compact">Compact</option>
                                    <option value="standard">Standard</option>
                                    <option value="dashboard">Dashboard</option>
                                </select>
                            </Row>
                        </div>
                    </section>
                )}

                {section === 'colors' && (
                    <section className="obs-st-panel">
                        <h2 className="obs-st-heading">Colors</h2>
                        <p className="obs-st-hint">Every color maps to a design token used across the entire panel.</p>
                        <div className="obs-st-grid2">
                            {(Object.keys(COLOR_TOKENS) as ColorKey[]).map((key) => (
                                <ColorRow key={key} label={COLOR_LABELS[key]}
                                    value={c[key]} fallback={fallbacks[key] || '#000000'}
                                    onChange={(v) => setColor(key, v)} />
                            ))}
                        </div>
                    </section>
                )}

                {section === 'typography' && (
                    <section className="obs-st-panel">
                        <h2 className="obs-st-heading">Typography, Spacing &amp; Shape</h2>
                        <div className="obs-st-grid2">
                            <DimRow label="Base font size" value={config.typography.scale} fallback="14px" onChange={(v) => push({ ...config, typography: { ...config.typography, scale: v } })} />
                            <DimRow label="Heading scale" value={config.typography.headingScale} fallback="1.25" onChange={(v) => push({ ...config, typography: { ...config.typography, headingScale: v } })} />
                            <DimRow label="Nav font size" value={config.typography.navSize} fallback="13px" onChange={(v) => push({ ...config, typography: { ...config.typography, navSize: v } })} />
                            <DimRow label="Mono font size" value={config.typography.monoSize} fallback="12.5px" onChange={(v) => push({ ...config, typography: { ...config.typography, monoSize: v } })} />
                            <DimRow label="Line height" value={config.typography.lineHeight} fallback="1.55" onChange={(v) => push({ ...config, typography: { ...config.typography, lineHeight: v } })} />
                            <DimRow label="Letter spacing" value={config.typography.letterSpacing} fallback="0.01em" onChange={(v) => push({ ...config, typography: { ...config.typography, letterSpacing: v } })} />
                            <DimRow label="Page padding" value={config.spacing.page} fallback="1.5rem" onChange={(v) => push({ ...config, spacing: { ...config.spacing, page: v } })} />
                            <DimRow label="Card gap" value={config.spacing.cardGap} fallback="1rem" onChange={(v) => push({ ...config, spacing: { ...config.spacing, cardGap: v } })} />
                            <DimRow label="Section gap" value={config.spacing.sectionGap} fallback="2rem" onChange={(v) => push({ ...config, spacing: { ...config.spacing, sectionGap: v } })} />
                            <DimRow label="Global radius" value={config.radius} fallback="6px" onChange={(v) => set('radius', v)} />
                            <DimRow label="Card radius" value={config.borders.cardRadius} fallback="8px" onChange={(v) => push({ ...config, borders: { ...config.borders, cardRadius: v } })} />
                            <DimRow label="Button radius" value={config.borders.buttonRadius} fallback="5px" onChange={(v) => push({ ...config, borders: { ...config.borders, buttonRadius: v } })} />
                            <DimRow label="Input radius" value={config.borders.inputRadius} fallback="5px" onChange={(v) => push({ ...config, borders: { ...config.borders, inputRadius: v } })} />
                            <DimRow label="Modal radius" value={config.borders.modalRadius} fallback="10px" onChange={(v) => push({ ...config, borders: { ...config.borders, modalRadius: v } })} />
                            <DimRow label="Border width" value={config.borders.width} fallback="1px" onChange={(v) => push({ ...config, borders: { ...config.borders, width: v } })} />
                        </div>
                        <div className="obs-st-group">
                            <Row label="Shadows">
                                <select className="obs-st-select" value={config.shadows}
                                    onChange={(e) => set('shadows', e.target.value as ShadowLevel)} aria-label="Shadow level">
                                    <option value="none">None</option>
                                    <option value="subtle">Subtle</option>
                                    <option value="medium">Medium</option>
                                </select>
                            </Row>
                            <DimRow label="Button height" value={config.buttons.height} fallback="36px" onChange={(v) => push({ ...config, buttons: { ...config.buttons, height: v } })} />
                            <DimRow label="Icon size" value={config.icons.size} fallback="16px" onChange={(v) => push({ ...config, icons: { ...config.icons, size: v } })} />
                        </div>
                    </section>
                )}

                {section === 'console' && (
                    <section className="obs-st-panel">
                        <h2 className="obs-st-heading">Console</h2>
                        <p className="obs-st-hint">Appearance only — the real WebSocket console, logs and command input are untouched.</p>
                        <div className="obs-st-grid2">
                            <ColorRow label="Console background" value={c.console} fallback={fallbacks.console || '#000000'} onChange={(v) => setColor('console', v)} />
                            <ColorRow label="Code background" value={c.code} fallback={fallbacks.code || '#000000'} onChange={(v) => setColor('code', v)} />
                            <DimRow label="Console height" value={config.console.height} fallback="24rem" onChange={(v) => push({ ...config, console: { ...config.console, height: v } })} />
                            <DimRow label="Console font size" value={config.console.fontSize} fallback="12.5px" onChange={(v) => push({ ...config, console: { ...config.console, fontSize: v } })} />
                            <DimRow label="Console line height" value={config.console.lineHeight} fallback="1.6" onChange={(v) => push({ ...config, console: { ...config.console, lineHeight: v } })} />
                            <DimRow label="Console padding" value={config.spacing.consolePad} fallback="0.75rem" onChange={(v) => push({ ...config, spacing: { ...config.spacing, consolePad: v } })} />
                        </div>
                    </section>
                )}

                {section === 'components' && (
                    <section className="obs-st-panel">
                        <h2 className="obs-st-heading">Components</h2>
                        <div className="obs-st-grid2">
                            <ColorRow label="Button" value={c.button} fallback={fallbacks.button || '#000000'} onChange={(v) => setColor('button', v)} />
                            <ColorRow label="Button hover" value={c.buttonHover} fallback={fallbacks.buttonHover || '#000000'} onChange={(v) => setColor('buttonHover', v)} />
                            <ColorRow label="Input" value={c.input} fallback={fallbacks.input || '#000000'} onChange={(v) => setColor('input', v)} />
                            <ColorRow label="Input focus" value={c.inputFocus} fallback={fallbacks.inputFocus || '#000000'} onChange={(v) => setColor('inputFocus', v)} />
                            <ColorRow label="Modal" value={c.modal} fallback={fallbacks.modal || '#000000'} onChange={(v) => setColor('modal', v)} />
                            <ColorRow label="Tooltip" value={c.tooltip} fallback={fallbacks.tooltip || '#000000'} onChange={(v) => setColor('tooltip', v)} />
                            <ColorRow label="Scrollbar" value={c.scrollbar} fallback={fallbacks.scrollbar || '#000000'} onChange={(v) => setColor('scrollbar', v)} />
                            <DimRow label="Button horizontal padding" value={config.buttons.padX} fallback="1rem" onChange={(v) => push({ ...config, buttons: { ...config.buttons, padX: v } })} />
                            <DimRow label="Icon spacing" value={config.icons.spacing} fallback="0.5rem" onChange={(v) => push({ ...config, icons: { ...config.icons, spacing: v } })} />
                            <DimRow label="Icon opacity" value={config.icons.opacity} fallback="0.85" onChange={(v) => push({ ...config, icons: { ...config.icons, opacity: v } })} />
                        </div>
                    </section>
                )}

                {section === 'status' && (
                    <section className="obs-st-panel">
                        <h2 className="obs-st-heading">Status Colors</h2>
                        <p className="obs-st-hint">Semantic server states. Indicators stay small and restrained by design.</p>
                        <div className="obs-st-grid2">
                            {STATUS_GROUPS[0].keys.map((key) => (
                                <ColorRow key={key} label={STATUS_LABELS[key]}
                                    value={config.statusColors[key]}
                                    fallback={PRESETS[config.preset]?.config.statusColors?.[key] || '#000000'}
                                    onChange={(v) => setStatus(key, v)} />
                            ))}
                        </div>
                    </section>
                )}

                {section === 'branding' && (
                    <section className="obs-st-panel">
                        <h2 className="obs-st-heading">Import / Export</h2>
                        <ImportExport config={config} onImport={(parsed) => push(parsed)} />
                    </section>
                )}
            </div>

            <footer className="obs-st-footer">
                <span>Obsidian Theme Studio · changes preview live · press Save to persist</span>
            </footer>
        </div>
    );
}






