import React from 'react';
import { useObsidian } from '../context/ObsidianContext';

interface ObsidianSidebarProps {
    children?: React.ReactNode;
    userAvatarUrl?: string;
    userName?: string;
    userRole?: string;
}

export const ObsidianSidebar: React.FC<ObsidianSidebarProps> = ({
    children,
    userAvatarUrl,
    userName = 'User',
    userRole = 'Administrator'
}) => {
    const { config, isSidebarOpen, setSidebarOpen } = useObsidian();

    return (
        <>
            {/* Mobile backdrop */}
            {isSidebarOpen && (
                <div 
                    className="obsidian-sidebar-backdrop" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            
            <aside className={`obsidian-sidebar ${isSidebarOpen ? 'obsidian-sidebar--open' : ''}`}>
                <a href="/" className="obsidian-sidebar__logo">
                    {config.branding.logoUrl ? (
                        <img src={config.branding.logoUrl} alt={config.branding.panelName} style={{ maxHeight: '32px' }} />
                    ) : (
                        <div className="obsidian-sidebar__logo-icon">
                            {config.branding.logoText?.[0] || config.branding.panelName?.[0] || 'K'}
                        </div>
                    )}
                    <div className="obsidian-sidebar__logo-text">
                        {config.branding.logoText || config.branding.panelName || 'obsidianTheme'}
                    </div>
                </a>

                <nav className="obsidian-sidebar__nav">
                    {children}
                </nav>

                <div className="obsidian-sidebar__footer">
                    <a href="/account" className="obsidian-sidebar__user">
                        <div className="obsidian-sidebar__avatar">
                            {userAvatarUrl ? (
                                <img src={userAvatarUrl} alt={userName} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                            ) : (
                                userName.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div className="obsidian-sidebar__username">{userName}</div>
                            <div className="obsidian-sidebar__role">{userRole}</div>
                        </div>
                    </a>
                </div>
            </aside>
        </>
    );
};

export default ObsidianSidebar;
