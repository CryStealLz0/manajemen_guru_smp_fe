// src/components/ui/Modal.jsx
import React from 'react';

export default function Modal({ open, title, children, onClose }) {
    if (!open) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
            }}
            onClick={onClose} // klik luar modal close
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: 8,
                    width: '100%',
                    maxWidth: 500,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    animation: 'fadeIn 0.2s ease-out',
                }}
                onClick={(e) => e.stopPropagation()} // biar klik isi modal gak nutup
            >
                {/* Header */}
                <div
                    style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontWeight: 600,
                        fontSize: 16,
                    }}
                >
                    <span>{title}</span>
                    <button
                        onClick={onClose}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            fontSize: 18,
                            cursor: 'pointer',
                            color: '#555',
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: 16 }}>{children}</div>
            </div>
        </div>
    );
}
