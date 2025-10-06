import React from 'react';

export function Button({ variant = 'default', children, ...props }) {
    const cls = ['btn'];
    if (variant === 'primary') cls.push('primary');
    if (variant === 'success') cls.push('success');
    if (variant === 'warn') cls.push('warn');
    if (variant === 'ghost') cls.push('ghost');
    return (
        <button className={cls.join(' ')} {...props}>
            {children}
        </button>
    );
}
