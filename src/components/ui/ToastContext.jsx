import React from 'react';

const Ctx = React.createContext(null);
export function ToastProvider({ children }) {
    const [items, setItems] = React.useState([]);
    const push = (type, msg) => {
        const id = crypto.randomUUID();
        setItems((s) => [...s, { id, type, msg }]);
        setTimeout(() => setItems((s) => s.filter((i) => i.id !== id)), 3000);
    };
    const api = {
        success: (m) => push('success', m),
        error: (m) => push('error', m),
        info: (m) => push('info', m),
    };
    return (
        <Ctx.Provider value={api}>
            {children}
            <div
                style={{
                    position: 'fixed',
                    right: 16,
                    top: 16,
                    display: 'grid',
                    gap: 8,
                    zIndex: 9999,
                }}
            >
                {items.map((i) => (
                    <div
                        key={i.id}
                        style={{
                            padding: '10px 12px',
                            borderRadius: 10,
                            boxShadow: '0 4px 14px rgba(0,0,0,.15)',
                            background:
                                i.type === 'error'
                                    ? '#fee2e2'
                                    : i.type === 'success'
                                    ? '#dcfce7'
                                    : '#e0f2fe',
                            border: '1px solid rgba(0,0,0,.06)',
                            minWidth: 240,
                        }}
                    >
                        {i.msg}
                    </div>
                ))}
            </div>
        </Ctx.Provider>
    );
}
export function useToast() {
    return React.useContext(Ctx);
}
