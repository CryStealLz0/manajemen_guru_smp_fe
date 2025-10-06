import React from 'react';

export default function ConfirmModal({
    open,
    title = 'Konfirmasi',
    message,
    children,
    confirmText = 'OK',
    cancelText = 'Batal',
    loading = false,
    danger = false, // kalau true, tombol konfirmasi merah
    onConfirm,
    onClose,
}) {
    React.useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.();
            if (e.key === 'Enter' && !loading) onConfirm?.();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, loading, onClose, onConfirm]);

    if (!open) return null;

    return (
        <div
            onClick={() => !loading && onClose?.()}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: 16,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                style={{
                    background: '#fff',
                    borderRadius: 12,
                    width: '100%',
                    maxWidth: 420,
                    boxShadow: '0 10px 30px rgba(0,0,0,.2)',
                }}
            >
                <div
                    id="confirm-title"
                    style={{
                        padding: '14px 16px',
                        borderBottom: '1px solid #eee',
                        fontWeight: 600,
                    }}
                >
                    {title}
                </div>

                <div style={{ padding: 16 }}>
                    {children ?? (
                        <p style={{ margin: 0, color: '#374151' }}>{message}</p>
                    )}
                </div>

                <div
                    style={{
                        padding: 12,
                        borderTop: '1px solid #eee',
                        display: 'flex',
                        gap: 8,
                        justifyContent: 'flex-end',
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            padding: '8px 12px',
                            borderRadius: 8,
                            border: '1px solid #e5e7eb',
                            background: '#fff',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        autoFocus
                        style={{
                            padding: '8px 12px',
                            borderRadius: 8,
                            border: '1px solid transparent',
                            background: danger ? '#ef4444' : '#3b82f6',
                            color: '#fff',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.85 : 1,
                        }}
                    >
                        {loading ? `${confirmText}…` : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
