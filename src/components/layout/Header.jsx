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
                <h1>
                    App Management Guru
                    {/* <small>— modular UI</small> */}
                </h1>
                {user ? (
                    <div
                        style={{
                            display: 'flex',
                            gap: 8,
                            alignItems: 'center',
                        }}
                    >
                        <span className="pill" style={{ color: 'black' }}>
                            {user.role}
                        </span>
                        <span className="muted" style={{ color: '#fff' }}>
                            {user.email}
                        </span>
                        <button className="btn" onClick={onLogout}>
                            Logout
                        </button>
                    </div>
                ) : null}
            </div>
        </header>
    );
}
