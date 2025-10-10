import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/auth/AuthProvider';

export default function LoginPage() {
    const { login } = useAuth();
    const nav = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname;

    const [form, setForm] = React.useState({ username: '', password: '' });
    const [fieldErrs, setFieldErrs] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [err, setErr] = React.useState('');
    const [touched, setTouched] = React.useState({
        username: false,
        password: false,
    });
    const [submitted, setSubmitted] = React.useState(false);

    const onChange = (key) => (e) => {
        setForm((s) => ({ ...s, [key]: e.target.value }));
        setFieldErrs((s) => ({ ...s, [key]: undefined }));
        setErr('');
    };
    const onBlur = (key) => () => setTouched((s) => ({ ...s, [key]: true }));

    // 🔹 Validasi lokal minimal
    const localRequiredErrors = React.useMemo(() => {
        const errs = {};
        const show = (k) => touched[k] || submitted;

        if (show('username') && !form.username.trim())
            errs.username = 'Username wajib diisi';

        if (show('password') && !form.password)
            errs.password = 'Password wajib diisi';
        else if (show('password') && form.password.length < 6)
            errs.password = 'Password minimal 6 karakter';

        return errs;
    }, [form, touched, submitted]);

    const mergeErr = (name) => fieldErrs[name] || localRequiredErrors[name];

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setErr('');

        // 🔸 Cek validasi lokal
        const reqErrs = {};
        if (!form.username.trim()) reqErrs.username = 'Username wajib diisi';
        if (!form.password) reqErrs.password = 'Password wajib diisi';
        else if (form.password.length < 6)
            reqErrs.password = 'Password minimal 6 karakter';

        if (Object.keys(reqErrs).length) {
            setFieldErrs(reqErrs);
            return;
        }

        setLoading(true);
        try {
            const { role } = await login(form.username.trim(), form.password);

            if (from && from !== '/login') {
                nav(from, { replace: true });
            } else {
                nav(role === 'admin' ? '/admin' : '/teacher', {
                    replace: true,
                });
            }
        } catch (error) {
            // 🔹 Tangani error sesuai format backend
            console.warn('Login error:', error);

            // backend format: { ok:false, msg:'...', errors:{ username:'...', password:'...' } }
            if (error.errors && typeof error.errors === 'object') {
                setFieldErrs(error.errors);
            } else if (error.message) {
                // fallback umum
                setErr(error.message);
            } else {
                setErr('Gagal login, coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="container"
            style={{ maxWidth: 420, margin: '48px auto' }}
        >
            <section
                className="card"
                style={{
                    padding: 24,
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    background: '#fff',
                }}
            >
                <h3 style={{ marginBottom: 16 }}>Masuk</h3>

                <form onSubmit={onSubmit} noValidate>
                    {/* Username */}
                    <div style={{ marginBottom: 12 }}>
                        <label
                            htmlFor="login-username"
                            style={{ display: 'block', marginBottom: 6 }}
                        >
                            Username
                        </label>
                        <input
                            id="login-username"
                            name="username"
                            type="text"
                            placeholder="mis. budi_guru"
                            value={form.username}
                            onChange={onChange('username')}
                            onBlur={onBlur('username')}
                            autoComplete="username"
                            spellCheck={false}
                            autoCapitalize="none"
                            aria-invalid={!!mergeErr('username')}
                            style={{ width: '100%' }}
                        />
                        {mergeErr('username') && (
                            <small style={{ color: '#ef4444' }}>
                                {mergeErr('username')}
                            </small>
                        )}
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: 12 }}>
                        <label
                            htmlFor="login-password"
                            style={{ display: 'block', marginBottom: 6 }}
                        >
                            Password
                        </label>
                        <input
                            id="login-password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={onChange('password')}
                            onBlur={onBlur('password')}
                            autoComplete="current-password"
                            aria-invalid={!!mergeErr('password')}
                            style={{ width: '100%' }}
                        />
                        {mergeErr('password') && (
                            <small style={{ color: '#ef4444' }}>
                                {mergeErr('password')}
                            </small>
                        )}
                    </div>

                    {/* Error global */}
                    {err && (
                        <p
                            style={{
                                color: '#ef4444',
                                marginTop: 4,
                                marginBottom: 8,
                            }}
                        >
                            {err}
                        </p>
                    )}

                    <div style={{ marginTop: 12 }}>
                        <button
                            className="btn primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Memproses…' : 'Login'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
