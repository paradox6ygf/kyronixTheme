import React from 'react';
import { useObsidian, ThemeMode, DensityMode, AnimationLevel } from '../context/ObsidianContext';

export const Customizer: React.FC = () => {
    const { 
        config, 
        isCustomizerOpen, 
        setCustomizerOpen, 
        updateConfig, 
        updateColors, 
        resetConfig,
        exportConfig 
    } = useObsidian();

    if (!isCustomizerOpen) return null;

    const handleColorChange = (key: string, value: string) => {
        updateColors({ [key]: value });
    };

    const handleCopyExport = () => {
        const json = exportConfig();
        navigator.clipboard.writeText(json);
        alert('Configuration copied to clipboard!');
    };

    return (
        <>
            <div 
                className="obsidian-sidebar-backdrop" 
                style={{ zIndex: 9998 }}
                onClick={() => setCustomizerOpen(false)}
            />
            <div 
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '380px',
                    background: 'var(--obsidian-card)',
                    borderLeft: '1px solid var(--obsidian-border)',
                    boxShadow: 'var(--obsidian-shadow-xl)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'obsidian-slide-in-right var(--obsidian-transition-spring) forwards'
                }}
            >
                <div style={{
                    padding: 'var(--obsidian-space-4) var(--obsidian-space-5)',
                    borderBottom: '1px solid var(--obsidian-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h2 style={{ fontSize: 'var(--obsidian-font-size-lg)', fontWeight: 'bold' }}>Theme Customizer</h2>
                    <button 
                        className="obsidian-btn obsidian-btn--ghost obsidian-btn--icon"
                        onClick={() => setCustomizerOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--obsidian-space-5)' }}>
                    
                    {/* Theme Mode */}
                    <div style={{ marginBottom: 'var(--obsidian-space-6)' }}>
                        <label className="obsidian-label">Color Scheme</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                            {(['dark', 'light', 'system'] as ThemeMode[]).map(mode => (
                                <button
                                    key={mode}
                                    className={`obsidian-btn ${config.mode === mode ? 'obsidian-btn--primary' : 'obsidian-btn--secondary'}`}
                                    onClick={() => updateConfig({ mode })}
                                    style={{ textTransform: 'capitalize' }}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Primary Color */}
                    <div style={{ marginBottom: 'var(--obsidian-space-6)' }}>
                        <label className="obsidian-label">Primary Color (HSL)</label>
                        <input 
                            type="text" 
                            className="obsidian-input"
                            value={config.colors.primary || ''}
                            placeholder="hsl(222, 70%, 58%)"
                            onChange={(e) => handleColorChange('primary', e.target.value)}
                        />
                    </div>

                    {/* Background Color */}
                    <div style={{ marginBottom: 'var(--obsidian-space-6)' }}>
                        <label className="obsidian-label">Background Color (HSL)</label>
                        <input 
                            type="text" 
                            className="obsidian-input"
                            value={config.colors.background || ''}
                            placeholder="hsl(220, 18%, 9%)"
                            onChange={(e) => handleColorChange('background', e.target.value)}
                        />
                    </div>

                    {/* Animation Level */}
                    <div style={{ marginBottom: 'var(--obsidian-space-6)' }}>
                        <label className="obsidian-label">Animation Level</label>
                        <select 
                            className="obsidian-input obsidian-select"
                            value={config.animation}
                            onChange={(e) => updateConfig({ animation: e.target.value as AnimationLevel })}
                        >
                            <option value="off">Off (Reduced Motion)</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium (Default)</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    {/* Density */}
                    <div style={{ marginBottom: 'var(--obsidian-space-6)' }}>
                        <label className="obsidian-label">Density</label>
                        <select 
                            className="obsidian-input obsidian-select"
                            value={config.density}
                            onChange={(e) => updateConfig({ density: e.target.value as DensityMode })}
                        >
                            <option value="compact">Compact</option>
                            <option value="default">Default</option>
                            <option value="comfortable">Comfortable</option>
                        </select>
                    </div>

                    {/* Custom CSS */}
                    <div style={{ marginBottom: 'var(--obsidian-space-6)' }}>
                        <label className="obsidian-label">Custom CSS</label>
                        <textarea 
                            className="obsidian-input obsidian-textarea"
                            value={config.customCSS || ''}
                            onChange={(e) => updateConfig({ customCSS: e.target.value })}
                            placeholder="/* Inject raw CSS here */"
                            style={{ fontFamily: 'var(--obsidian-font-mono)', fontSize: '12px' }}
                        />
                    </div>
                </div>

                <div style={{
                    padding: 'var(--obsidian-space-4)',
                    borderTop: '1px solid var(--obsidian-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}>
                    <button className="obsidian-btn obsidian-btn--primary obsidian-btn--full" onClick={handleCopyExport}>
                        Export Config (Copy JSON)
                    </button>
                    <button className="obsidian-btn obsidian-btn--danger-outline obsidian-btn--full" onClick={resetConfig}>
                        Reset to Defaults
                    </button>
                </div>
            </div>
        </>
    );
};

export default Customizer;
