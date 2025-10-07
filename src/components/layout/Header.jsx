import React from 'react';
import { useAuth } from '../../app/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const { user, logout } = useAuth();
    const nav = useNavigate();

    const onLogout = () => {
        logout();
        nav('/login', { replace: true });
    };

    const goToProfile = () => {
        nav('/profile');
    };

    return (
        <header className="topbar">
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    alignItems: 'center',
                }}
            >
                <h1>App Management Guru</h1>
                {user && (
                    <div
                        style={{
                            display: 'flex',
                            gap: 8,
                            alignItems: 'center',
                        }}
                    >
                        {/* 👇 Klik nama untuk ke halaman Profile */}
                        <button
                            onClick={goToProfile}
                            className="pill"
                            style={{
                                color: 'black',
                                background: 'white',
                                border: 'none',
                                borderRadius: '16px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                fontWeight: 600,
                            }}
                        >
                            {user.full_name || user.username}
                        </button>

                        <span className="muted" style={{ color: '#fff' }}>
                            {user.username}
                        </span>
                        <button className="btn" onClick={onLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
