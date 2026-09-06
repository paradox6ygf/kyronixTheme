import React, { useEffect, useState } from 'react';
import './theme.css';
import { ObsidianProvider, useObsidian } from '../context/KyronixContext';

const FloatButton: React.FC = () => {
    const { setCustomizerOpen } = useObsidian();
    const [visible, setVisible] = useState(true);
    if (!visible) return null;
    return (
        <div style={{
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
            display: 'flex', alignItems: 'center', gap: '8px',
        }}>
            <button onClick={() => setCustomizerOpen(true)} style={{
                padding: '12px 20px',
                borderRadius: 'var(--obsidian-radius, 999px)',
                border: 'none',
                background: 'linear-gradient(135deg, var(--obsidian-primary, #b5e48c), var(--obsidian-accent, #d9ed92))',
                color: '#0d1117', fontWeight: 700, fontSize: '13px',
                cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}>Customize Obsidian</button>
            <button onClick={() => setVisible(false)} title="Hide" style={{
                width: '28px', height: '28px', borderRadius: '50%',
                border: '1px solid var(--obsidian-border, #333)',
                background: 'var(--obsidian-surface, #1a1a1a)',
                color: 'var(--obsidian-text, #eee)', cursor: 'pointer', fontSize: '14px', lineHeight: 1,
            }}>\u00d7</button>
        </div>
    );
};

export const ObsidianBootstrap: React.FC = () => {
    return (
        <ObsidianProvider>
            <FloatButton />
        </ObsidianProvider>
    );
};

export default ObsidianBootstrap;