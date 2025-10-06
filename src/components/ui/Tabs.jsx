import React from 'react';

export function Tabs({ value, onChange, items }) {
    return (
        <div className="tabs">
            {items.map((it) => (
                <button
                    key={it.value}
                    className={`tab-btn ${value === it.value ? 'active' : ''}`}
                    onClick={() => onChange(it.value)}
                    type="button"
                >
                    {it.label}
                </button>
            ))}
        </div>
    );
}
