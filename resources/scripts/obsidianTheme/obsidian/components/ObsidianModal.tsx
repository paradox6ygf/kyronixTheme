import React, { useEffect } from 'react';

export interface ObsidianModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closeOnBackdropClick?: boolean;
}

export const ObsidianModal: React.FC<ObsidianModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeOnBackdropClick = true
}) => {
    // Prevent body scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    const sizeClass = size !== 'md' ? `obsidian-modal--${size}` : '';

    return (
        <div className="obsidian-modal-backdrop" onClick={handleBackdropClick}>
            <div className={`obsidian-modal ${sizeClass}`}>
                <div className="obsidian-modal__header">
                    <h2 className="obsidian-modal__title">{title}</h2>
                    <button className="obsidian-modal__close" onClick={onClose} aria-label="Close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className="obsidian-modal__body">
                    {children}
                </div>
                {footer && (
                    <div className="obsidian-modal__footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ObsidianModal;
