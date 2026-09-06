import React from 'react';

export interface ObsidianBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
    dot?: boolean;
    pulsing?: boolean;
}

export const ObsidianBadge: React.FC<ObsidianBadgeProps> = ({
    variant = 'neutral',
    dot,
    pulsing,
    className = '',
    children,
    ...props
}) => {
    const classes = [
        'obsidian-badge',
        `obsidian-badge--${variant}`,
        pulsing ? 'obsidian-badge--pulsing' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <span className={classes} {...props}>
            {dot && <span className="obsidian-badge__dot" />}
            {children}
        </span>
    );
};

export default ObsidianBadge;
