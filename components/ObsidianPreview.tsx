/**
 * obsidianTheme — Live Preview stage for the Theme Studio.
 * Renders a representative slice of the panel (server grid, navigation,
 * console, buttons) inside a device-sized frame, driven by the SAME config →
 * tokens/attributes chain as the real panel. Values shown are representative
 * preview data only — real server data always comes from Pterodactyl.
 */
import React, { useState } from 'react';
import { ObsidianConfig } from './obsidianConfig';

const DEVICES = [
    { id: 'mobile', label: 'Mobile', width: 375 },
    { id: 'tablet', label: 'Tablet', width: 768 },
    { id: 'laptop', label: 'Laptop', width: 1366 },
    { id: 'desktop', label: 'Desktop', width: 1920 },
];
const ZOOMS = [50, 75, 100, 125];
const SAMPLE = [
    { name: 'Preview Server A', addr: 'node-1 · 25565', status: 'online', label: 'ONLINE', cpu: '0.13%', ram: '263MB', disk: '455MB' },
    { name: 'Preview Server B', addr: 'node-1 · 25565', status: 'starting', label: 'STARTING', cpu: '1.93%', ram: '918MB', disk: '345MB' },
    { name: 'Preview Server C', addr: 'node-2 · 27015', status: 'offline', label: 'OFFLINE', cpu: '0.00%', ram: '0MB', disk: '1.2GB' },
];

function colsFor(grid) {
    switch (grid) {
        case '1': return 'minmax(0,1fr)';
        case '2': return 'repeat(2, minmax(0,1fr))';
        case '3': return 'repeat(3, minmax(0,1fr))';
        case '4': return 'repeat(4, minmax(0,1fr))';
        case 'autofill': return 'repeat(auto-fill, minmax(240px, 1fr))';
        default: return 'repeat(auto-fit, minmax(240px, 1fr))';
    }
}

function accentStyle(pos, color) {
    const w = '3px';
    switch (pos) {
        case 'bottom': return { borderBottom: w + ' solid ' + color };
        case 'left': return { borderLeft: w + ' solid ' + color };
        case 'right': return { borderRight: w + ' solid ' + color };
        case 'top': return { borderTop: w + ' solid ' + color };
        default: return {};
    }
}
export default function ObsidianPreview({ config }) {
    const [device, setDevice] = useState('laptop');
    const [zoom, setZoom] = useState(100);
    const width = (DEVICES.find((d) => d.id === device) || DEVICES[2]).width;
    const sidebarHidden = config.layout.sidebar === 'hidden';
    const statusPos = config.layout.statusPos || 'top';
    const navItems = ['Console', 'Files', 'Databases', 'Schedules', 'Users', 'Backups', 'Network', 'Startup', 'Settings', 'Activity'];
    return (
        <div className="obs-prev-wrap">
            <div className="obs-prev-toolbar">
                <span className="obs-prev-label">Live preview</span>
                <div className="obs-prev-btns">
                    {DEVICES.map((d) => (
                        <button key={d.id} className={'obs-st-btn' + (device === d.id ? ' is-active' : '')}
                            onClick={() => setDevice(d.id)} aria-label={'Preview on ' + d.label}>{d.label}</button>
                    ))}
                    <span className="obs-prev-sep" />
                    {ZOOMS.map((z) => (
                        <button key={z} className={'obs-st-btn' + (zoom === z ? ' is-active' : '')}
                            onClick={() => setZoom(z)} aria-label={'Zoom ' + z + ' percent'}>{z}%</button>
                    ))}
                </div>
            </div>
            <div className="obs-prev-scroll">
                <div className="obs-prev-frame" style={{ width, transform: 'scale(' + zoom / 100 + ')' }}>
                    <div className="obs-prev-topbar" style={{ background: 'var(--obsidian-navbar)' }}>
                        <span className="obs-prev-brand">Obsidian</span>
                        <span className="obs-prev-chip">dashboard</span>
                        <span className="obs-prev-avatar" />
                    </div>
                    <div className="obs-prev-shell">
                        {!sidebarHidden && (
                            <aside className="obs-prev-sidebar" style={{ background: 'var(--obsidian-sidebar)' }}>
                                {navItems.map((n, i) => (
                                    <div key={n} className={'obs-prev-navitem' + (i === 0 ? ' is-active' : '')}
                                        style={{ fontSize: config.typography.navSize }}>{n}</div>
                                ))}
                            </aside>
                        )}
                        <main className="obs-prev-main" style={{ padding: config.spacing.page, fontSize: config.typography.scale }}>
                            <div className="obs-prev-grid" style={{ gridTemplateColumns: colsFor(config.layout.serverGrid), gap: config.spacing.cardGap }}>
                                {SAMPLE.map((s) => {
                                    const statVar = s.status === 'online' ? 'var(--obsidian-status-online)'
                                        : s.status === 'starting' ? 'var(--obsidian-status-starting)' : 'var(--obsidian-status-offline)';
                                    return (
                                        <div key={s.name} className="obs-prev-card" style={Object.assign({
                                            borderRadius: config.borders.cardRadius,
                                            padding: config.layout.cardPad || '1.125rem',
                                            background: 'var(--obsidian-surface)',
                                            borderColor: 'var(--obsidian-border)',
                                        }, accentStyle(statusPos, statVar))}>
                                            <div className="obs-prev-card-name" style={{ fontWeight: Number(config.typography.weightHeadings) || 600 }}>{s.name}</div>
                                            <div className="obs-prev-card-addr" style={{ color: 'var(--obsidian-text-muted)' }}>{s.addr}</div>
                                            <div className="obs-prev-card-stats">
                                                <span>CPU <b>{s.cpu}</b></span>
                                                <span>RAM <b>{s.ram}</b></span>
                                                <span>DISK <b>{s.disk}</b></span>
                                            </div>
                                            {statusPos !== 'hidden' && (statusPos === 'inline' || statusPos === 'bottom') && (
                                                <div className="obs-prev-status" style={{ color: statVar }}>
                                                    <span className="obs-prev-dot" style={{ background: statVar }} />{s.label}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="obs-prev-console" style={{ background: config.console.bg, color: config.console.text, fontSize: config.console.fontSize, lineHeight: config.console.lineHeight, borderRadius: config.borders.modalRadius }}>
                                <div>[2026-09-07 12:00:01] [Server thread/INFO]: Starting minecraft server version 1.21</div>
                                <div>[2026-09-07 12:00:02] [Server thread/INFO]: Done (2.4s)! For help, type "help"</div>
                                <div className="obs-prev-cmdline">&gt; <span className="obs-prev-caret" /></div>
                            </div>
                            <div className="obs-prev-btnrow">
                                <button className="obs-prev-btn" style={{ background: 'var(--obsidian-success)', color: '#0d1117', borderRadius: config.borders.buttonRadius, height: config.buttons.height, padding: '0 ' + config.buttons.paddingX }}>Start</button>
                                <button className="obs-prev-btn" style={{ background: 'var(--obsidian-info)', color: '#0d1117', borderRadius: config.borders.buttonRadius, height: config.buttons.height, padding: '0 ' + config.buttons.paddingX }}>Restart</button>
                                <button className="obs-prev-btn" style={{ background: 'var(--obsidian-danger)', color: '#fff', borderRadius: config.borders.buttonRadius, height: config.buttons.height, padding: '0 ' + config.buttons.paddingX }}>Stop</button>
                            </div>
                            <p className="obs-prev-note">Representative preview data — the saved configuration drives the real panel.</p>

                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}

