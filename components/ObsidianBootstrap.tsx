import React, { useEffect, useState } from 'react';
import './theme.css';

const TOKENS: Record<string, string> = {
    primary: '--obsidian-primary', secondary: '--obsidian-secondary', accent: '--obsidian-accent',
    background: '--obsidian-background', surface: '--obsidian-surface', sidebar: '--obsidian-sidebar',
    navbar: '--obsidian-navbar', text: '--obsidian-text', mutedText: '--obsidian-text-muted',
    border: '--obsidian-border', success: '--obsidian-success', warning: '--obsidian-warning',
    danger: '--obsidian-danger', info: '--obsidian-info', button: '--obsidian-button-bg',
    buttonHover: '--obsidian-button-hover', input: '--obsidian-input-bg', inputFocus: '--obsidian-input-focus',
    console: '--obsidian-console-bg', code: '--obsidian-code-bg', scrollbar: '--obsidian-scrollbar',
    modal: '--obsidian-modal-bg', tooltip: '--obsidian-tooltip-bg',
};

export const ObsidianBootstrap: React.FC = () => {
    useEffect(() => {
        try {
            const raw = localStorage.getItem('obsidian:config');
            if (!raw) return;
            const cfg = JSON.parse(raw);
            const root = document.documentElement;
            let mode = cfg.mode || 'dark';
            if (mode === 'system') mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.setAttribute('data-obsidian-theme', mode);
            root.setAttribute('data-obsidian-animation', cfg.animation || 'medium');
            root.setAttribute('data-obsidian-density', cfg.density || 'default');
            for (const [key, cssVar] of Object.entries(TOKENS)) {
                if (cfg.colors?.[key]) root.style.setProperty(cssVar, cfg.colors[key]);
            }
            if (cfg.radius) root.style.setProperty('--obsidian-radius', cfg.radius);
        } catch (e) { /* noop */ }
    }, []);

    const [visible, setVisible] = useState(true);
    if (!visible) return null;

    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => { window.location.hash = '#/account/customizer'; }} style={{
                padding: '12px 20px', borderRadius: 'var(--obsidian-radius, 999px)', border: 'none',
                background: 'linear-gradient(135deg, var(--obsidian-primary, #b5e48c), var(--obsidian-accent, #d9ed92))',
                color: '#0d1117', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}>Customize Obsidian</button>
            <button onClick={() => setVisible(false)} title="Hide" style={{
                width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--obsidian-border, #333)',
                background: 'var(--obsidian-surface, #1a1a1a)', color: 'var(--obsidian-text, #eee)',
                cursor: 'pointer', fontSize: '14px', lineHeight: 1,
            }}>x</button>
        </div>
    );
};

export default ObsidianBootstrap;