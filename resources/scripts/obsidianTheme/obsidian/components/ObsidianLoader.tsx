import React from 'react';

export interface ObsidianLoaderProps {
    type?: 'spinner' | 'dots' | 'skeleton';
    size?: 'sm' | 'md' | 'lg';
    centered?: boolean;
}

export const ObsidianLoader: React.FC<ObsidianLoaderProps> = ({
    type = 'spinner',
    size = 'md',
    centered = false
}) => {
    let content = null;

    if (type === 'spinner') {
        const sizeClass = size !== 'md' ? `obsidian-spinner--${size}` : '';
        content = <div className={`obsidian-spinner ${sizeClass}`} />;
    } else if (type === 'dots') {
        content = (
            <div className="obsidian-loading-dots">
                <span />
                <span />
                <span />
            </div>
        );
    } else if (type === 'skeleton') {
        return <div className="obsidian-skeleton" style={{ width: '100%', height: '20px' }} />;
    }

    if (centered) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'var(--obsidian-space-8)' }}>
                {content}
            </div>
        );
    }

    return <>{content}</>;
};

export default ObsidianLoader;
