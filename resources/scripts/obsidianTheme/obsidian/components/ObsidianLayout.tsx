import React from 'react';

interface ObsidianLayoutProps {
    sidebar?: React.ReactNode;
    navbar?: React.ReactNode;
    children: React.ReactNode;
}

export const ObsidianLayout: React.FC<ObsidianLayoutProps> = ({ sidebar, navbar, children }) => {
    return (
        <div className="obsidian-shell">
            {sidebar}
            <div className="obsidian-main">
                {navbar}
                <div className="obsidian-content obsidian-animate-fade-in-up">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ObsidianLayout;
