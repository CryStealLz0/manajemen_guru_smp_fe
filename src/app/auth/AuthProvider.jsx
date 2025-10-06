import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { apiFetch } from '../../services/apiFetch';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // { id, full_name, username, role }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Hydrate sesi saat mount
    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                // Jika backend /auth/me selalu 200:
                const data = await apiFetch('/auth/me'); // { ok, msg, user }
                if (!ignore) setUser(data?.user ?? null);
            } catch {
                if (!ignore) setUser(null);
            } finally {
                if (!ignore) setLoading(false);
            }
        })();
        return () => {
            ignore = true;
        };
    }, []);

    const login = async (username, password) => {
        setError('');
        const data = await apiFetch('/auth/login', {
            method: 'POST',
            body: { username, password },
        }); // { ok, msg, user }
        setUser(data.user);
        return { role: data.user?.role || 'teacher' };
    };

    const logout = async () => {
        try {
            await apiFetch('/auth/logout', { method: 'POST' });
        } catch {}
        setUser(null);
    };

    // optional: kapan pun butuh sinkron sesi dari server
    const refreshMe = async () => {
        const data = await apiFetch('/auth/me');
        setUser(data?.user ?? null);
        return data?.user ?? null;
    };

    const value = useMemo(
        () => ({
            user,
            loading,
            error,
            setError,
            login,
            logout,
            refreshMe,
        }),
        [user, loading, error],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
