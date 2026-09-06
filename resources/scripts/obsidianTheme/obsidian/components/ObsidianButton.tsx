import React from 'react';

export interface ObsidianButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'danger-outline' | 'success' | 'ghost';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    iconOnly?: boolean;
    isLoading?: boolean;
}

export const ObsidianButton = React.forwardRef<HTMLButtonElement, ObsidianButtonProps>(({
    variant = 'primary',
    size = 'md',
    fullWidth,
    iconOnly,
    isLoading,
    className = '',
    disabled,
    children,
    ...props
}, ref) => {
    const classes = [
        'obsidian-btn',
        `obsidian-btn--${variant}`,
        size !== 'md' ? `obsidian-btn--${size}` : '',
        fullWidth ? 'obsidian-btn--full' : '',
        iconOnly ? 'obsidian-btn--icon' : '',
        isLoading ? 'obsidian-btn--loading' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            ref={ref}
            className={classes}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="obsidian-spinner obsidian-spinner--sm" />
            ) : null}
            {children}
        </button>
    );
});

ObsidianButton.displayName = 'ObsidianButton';

export default ObsidianButton;
