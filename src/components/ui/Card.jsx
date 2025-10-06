import React from 'react';

export default function Card({ title, subtitle, actions, children }) {
    return (
        <section className="card">
            {title && <h3>{title}</h3>}
            {subtitle && (
                <p className="muted" style={{ marginTop: -6 }}>
                    {subtitle}
                </p>
            )}
            {children}
            {actions && <div className="actions">{actions}</div>}
        </section>
    );
}
