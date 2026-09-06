import React from 'react';
import { ObsidianProvider, useObsidian } from '../obsidian/context/ObsidianContext';
import { ObsidianCard } from '../obsidian/components/ObsidianCard';
import { ObsidianButton } from '../obsidian/components/ObsidianButton';
import { ObsidianInput } from '../obsidian/components/ObsidianInput';

// This overrides Pterodactyl's LoginContainer.tsx
// To apply: copy over the original file or wrap it in the build step

const LoginContent: React.FC = () => {
    const { config } = useObsidian();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: config.branding.loginBackground 
                ? `url(${config.branding.loginBackground}) center/cover no-repeat` 
                : 'var(--obsidian-background)',
            padding: 'var(--obsidian-space-4)'
        }}>
            {/* Optional Overlay if background image exists */}
            {config.branding.loginBackground && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--obsidian-overlay-light)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 0
                }} />
            )}

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }} className="obsidian-animate-scale-in">
                
                <div style={{ textAlign: 'center', marginBottom: 'var(--obsidian-space-8)' }}>
                    {config.branding.loginLogoUrl ? (
                        <img 
                            src={config.branding.loginLogoUrl} 
                            alt={config.branding.panelName} 
                            style={{ maxHeight: '80px', margin: '0 auto' }} 
                        />
                    ) : (
                        <h1 style={{ 
                            fontSize: 'var(--obsidian-font-size-3xl)', 
                            fontWeight: 'bold', 
                            color: 'var(--obsidian-text-heading)' 
                        }}>
                            {config.branding.panelName || 'obsidianTheme'}
                        </h1>
                    )}
                </div>

                <ObsidianCard elevated>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--obsidian-space-4)' }}>
                            <ObsidianInput 
                                label="Username or Email" 
                                type="text" 
                                placeholder="admin@example.com"
                                required
                            />
                            
                            <ObsidianInput 
                                label="Password" 
                                type="password" 
                                placeholder="••••••••"
                                required
                            />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--obsidian-space-2)' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--obsidian-font-size-sm)', cursor: 'pointer' }}>
                                    <input type="checkbox" className="obsidian-input" style={{ width: 'auto' }} />
                                    <span>Remember Me</span>
                                </label>
                                <a href="/auth/password" style={{ fontSize: 'var(--obsidian-font-size-sm)' }}>
                                    Forgot password?
                                </a>
                            </div>

                            <ObsidianButton type="submit" variant="primary" fullWidth size="lg" style={{ marginTop: 'var(--obsidian-space-4)' }}>
                                Login to Panel
                            </ObsidianButton>
                        </div>
                    </form>
                </ObsidianCard>

                {config.branding.footerText && (
                    <div style={{ 
                        textAlign: 'center', 
                        marginTop: 'var(--obsidian-space-6)', 
                        fontSize: 'var(--obsidian-font-size-sm)',
                        color: 'var(--obsidian-text-muted)'
                    }}>
                        {config.branding.footerText}
                    </div>
                )}
            </div>
        </div>
    );
};

export const ObsidianLogin: React.FC = () => {
    return (
        <ObsidianProvider>
            <LoginContent />
        </ObsidianProvider>
    );
};

export default ObsidianLogin;
