/**
 * obsidianTheme — global bootstrap component.
 * Injected by Blueprint at Dashboard/Global/BeforeSection and
 * Authentication/Container/BeforeContent. Applies the saved theme
 * configuration as early as possible and keeps it live.
 */
import React, { useEffect } from 'react';
import './theme.css';
import { applyConfig, loadConfig } from './obsidianConfig';

export const ObsidianBootstrap: React.FC = () => {
    useEffect(() => {
        applyConfig(loadConfig());

        const onChange = () => applyConfig(loadConfig());
        window.addEventListener('obsidian:config-changed', onChange);
        window.addEventListener('storage', onChange);

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const onScheme = () => {
            const cfg = loadConfig();
            if (cfg.mode === 'system') applyConfig(cfg);
        };
        media.addEventListener('change', onScheme);

        return () => {
            window.removeEventListener('obsidian:config-changed', onChange);
            window.removeEventListener('storage', onChange);
            media.removeEventListener('change', onScheme);
        };
    }, []);

    return null;
};

export default ObsidianBootstrap;