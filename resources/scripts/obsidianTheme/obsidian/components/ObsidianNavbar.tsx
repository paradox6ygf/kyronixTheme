import React from 'react';
import { useObsidian } from '../context/ObsidianContext';

interface ObsidianNavbarProps {
    breadcrumbs?: Array<{ label: string; href?: string }>;
    children?: React.ReactNode;
}

export const ObsidianNavbar: React.FC<ObsidianNavbarProps> = ({ breadcrumbs = [], children }) => {
    const { toggleSidebar, setCustomizerOpen } = useObsidian();

    return (
        <header className="obsidian-navbar">
            <button className="obsidian-navbar__menu-toggle" onClick={toggleSidebar} aria-label="Toggle Menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>

            <div className="obsidian-navbar__breadcrumbs">
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                        {crumb.href ? (
                            <a href={crumb.href} className="obsidian-breadcrumb">
                                {crumb.label}
                            </a>
                        ) : (
                            <span className="obsidian-breadcrumb obsidian-breadcrumb--current">
                                {crumb.label}
                            </span>
                        )}
                        {index < breadcrumbs.length - 1 && (
                            <span className="obsidian-breadcrumb__sep">/</span>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="obsidian-navbar__actions">
                {children}
                
                {/* Theme Customizer Toggle */}
                <button 
                    className="obsidian-btn obsidian-btn--ghost obsidian-btn--icon" 
                    onClick={() => setCustomizerOpen(true)}
                    title="Theme Customizer"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default ObsidianNavbar;
