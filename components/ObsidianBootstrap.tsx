import React, { useEffect, useState } from 'react';
import './theme.css';
import { loadConfig, applyConfig } from './obsidianConfig';

export const ObsidianBootstrap: React.FC = () => {
    useEffect(() => {
        // Apply the saved config (colors, layout, animation, density) globally.
        // Idempotent: safe on every page render, both dashboard and login.
        applyConfig(loadConfig());
    }, []);

    const [visible, setVisible] = useState(true);
    if (!visible) return null;

    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => { window.location.href = '/account/customizer'; }} style={{
                padding: '11px 18px', borderRadius: 'var(--obsidian-radius, 10px)', border: '1px solid var(--obsidian-border, #333)',
                background: 'var(--obsidian-primary, #20344f)', color: 'var(--obsidian-text-heading, #f5f7fa)',
                fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
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