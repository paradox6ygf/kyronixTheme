import React from 'react';

export interface ObsidianInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: string;
    error?: string;
    wrapperClassName?: string;
}

export const ObsidianInput = React.forwardRef<HTMLInputElement, ObsidianInputProps>(({
    label,
    hint,
    error,
    className = '',
    wrapperClassName = '',
    required,
    ...props
}, ref) => {
    return (
        <div className={`obsidian-field ${wrapperClassName}`}>
            {label && (
                <label className={`obsidian-label ${required ? 'obsidian-label--required' : ''}`}>
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={`obsidian-input ${error ? 'obsidian-input--error' : ''} ${className}`}
                required={required}
                {...props}
            />
            {error && <div className="obsidian-field__error">{error}</div>}
            {hint && !error && <div className="obsidian-field__hint">{hint}</div>}
        </div>
    );
});

ObsidianInput.displayName = 'ObsidianInput';

export default ObsidianInput;
