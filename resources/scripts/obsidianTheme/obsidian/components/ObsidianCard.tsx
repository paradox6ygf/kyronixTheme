import React from 'react';

export interface ObsidianCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    interactive?: boolean;
    flat?: boolean;
    elevated?: boolean;
    glow?: boolean;
    headerAction?: React.ReactNode;
    footer?: React.ReactNode;
    noPadding?: boolean;
}

export const ObsidianCard: React.FC<ObsidianCardProps> = ({
    title,
    subtitle,
    interactive,
    flat,
    elevated,
    glow,
    headerAction,
    footer,
    noPadding,
    className = '',
    children,
    ...props
}) => {
    const classes = [
        'obsidian-card',
        interactive ? 'obsidian-card--interactive' : '',
        flat ? 'obsidian-card--flat' : '',
        elevated ? 'obsidian-card--elevated' : '',
        glow ? 'obsidian-card--glow' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} {...props}>
            {(title || subtitle || headerAction) && (
                <div className="obsidian-card__header">
                    <div>
                        {title && <h3 className="obsidian-card__title">{title}</h3>}
                        {subtitle && <div className="obsidian-card__subtitle">{subtitle}</div>}
                    </div>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}
            
            <div className={noPadding ? '' : 'obsidian-card__body'}>
                {children}
            </div>

            {footer && (
                <div className="obsidian-card__footer" style={{ 
                    borderTop: '1px solid var(--obsidian-border-subtle)', 
                    paddingTop: 'var(--obsidian-space-4)', 
                    marginTop: 'var(--obsidian-space-4)' 
                }}>
                    {footer}
                </div>
            )}
        </div>
    );
};

export default ObsidianCard;
