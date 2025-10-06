import React from 'react';
import Card from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Field, Row } from '../../../../components/ui/Form';
import { useToast } from '../../../../components/ui/ToastContext';
import { AdminApi } from '../../../../services/apiClient';

export default function UserForm({ roles = [], onCreate }) {
    // --- state dasar ---
    const toast = useToast();

    const [loading, setLoading] = React.useState(false);
    const [fieldErrs, setFieldErrs] = React.useState({});

    // roles (dari props atau fetch)
    const [localRoles, setLocalRoles] = React.useState([]);
    const [loadingRoles, setLoadingRoles] = React.useState(false);
    const rolesFromApi = roles?.length ? roles : localRoles;

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfPassword, setShowConfPassword] = React.useState(false);

    // form state (role_id string agar cocok dengan <select value>)
    const INIT = {
        full_name: '',
        username: '',
        nip: '',
        phone: '',
        password: '',
        confPassword: '',
        role_id: '', // jangan isi 'teacher' di sini; nanti auto-set setelah roles siap
    };
    const [f, setF] = React.useState(INIT);

    const set = (k) => (e) => {
        const v = e?.target?.value ?? '';
        setF((s) => ({ ...s, [k]: v }));
        setFieldErrs((errs) => ({ ...errs, [k]: undefined }));
    };

    // --- guards untuk mencegah loop ---
    const didFetchRoles = React.useRef(false);
    const hasSetDefaultRole = React.useRef(false);

    // daftar roles final yg dipakai form (props > local)
    const rolesList = roles?.length ? roles : localRoles;

    // kunci stabil: hanya berubah kalau komposisi roles berubah
    const rolesKey = React.useMemo(
        () => (rolesList || []).map((r) => r.id).join(','),
        [rolesList],
    );

    // 1) fetch roles kalau props roles TIDAK disuplai dari parent
    React.useEffect(() => {
        // kalau parent sudah nyuplai roles (length > 0), jangan fetch
        if (roles?.length > 0) return;
        if (didFetchRoles.current) return;
        didFetchRoles.current = true;

        let cancelled = false;
        setLoadingRoles(true);
        (async () => {
            try {
                const res = await AdminApi.getRoles();
                if (!cancelled) setLocalRoles(res?.data ?? []);
            } catch (e) {
                if (!cancelled)
                    toast.error(e?.message || 'Gagal memuat data role');
            } finally {
                // SELALU balikin ke false meskipun cancelled,
                // supaya UI tidak nyangkut di "Memuat role…"
                setLoadingRoles(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [roles?.length]);

    // 2) set default "teacher" SEKALI setelah roles siap (berdasarkan rolesKey)
    React.useEffect(() => {
        if (hasSetDefaultRole.current) return;
        if (!rolesList || rolesList.length === 0) return;

        const teacher = rolesList.find(
            (r) => String(r.name).toLowerCase() === 'teacher',
        );
        if (!teacher) return;

        // hanya set kalau masih kosong
        setF((s) => (s.role_id ? s : { ...s, role_id: String(teacher.id) }));
        hasSetDefaultRole.current = true;
    }, [rolesKey]); // <- stabil; tidak sensitif ke referensi array baru

    const validate = () => {
        const errs = {};
        if (!f.full_name?.trim()) errs.full_name = 'Nama lengkap wajib diisi';
        if (!f.username?.trim()) errs.username = 'Username wajib diisi';
        if (!f.password) errs.password = 'Password wajib diisi';
        if (f.password !== f.confPassword)
            errs.confPassword = 'Konfirmasi tidak cocok';
        if (!f.role_id) errs.role_id = 'Role wajib dipilih';
        setFieldErrs(errs);
        return Object.keys(errs).length === 0;
    };

    // Normalisasi payload utk server (hapus confPassword, trim seperlunya)
    const toPayload = () => ({
        full_name: f.full_name.trim(),
        username: f.username.trim(),
        nip: (f.nip ?? '').trim(),
        phone: (f.phone ?? '').trim(),
        password: f.password,
        role_id: f.role_id, // pastikan ini number kalau backend butuh number: Number(f.role_id)
    });

    const submit = async () => {
        if (loading) return; // cegah double click
        setFieldErrs({});

        if (!validate()) {
            toast.error('Periksa kembali input kamu.');
            return;
        }

        try {
            setLoading(true);
            const creator =
                onCreate || ((payload) => AdminApi.createUser(payload));
            const res = await creator(toPayload()); // harapannya return { msg, data }
            toast.success(res?.msg || 'User berhasil dibuat');

            // reset form
            setF(INIT);
        } catch (e) {
            // jika server kirim { errors: { field: '...' } }
            if (e?.fieldErrors && typeof e.fieldErrors === 'object') {
                setFieldErrs(e.fieldErrors);
            }
            toast.error(e?.message || 'Gagal membuat user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="Buat Akun User">
            <Row>
                <Field label="Nama Lengkap" error={fieldErrs.full_name}>
                    <input
                        value={f.full_name}
                        onChange={set('full_name')}
                        placeholder="Nama User"
                    />
                </Field>
                <Field label="Username" error={fieldErrs.username}>
                    <input
                        value={f.username}
                        onChange={set('username')}
                        placeholder="Username unik"
                    />
                </Field>
            </Row>

            <Row>
                <Field label="NIP (opsional)" error={fieldErrs.nip}>
                    <input
                        value={f.nip}
                        onChange={set('nip')}
                        placeholder="NIP guru"
                    />
                </Field>
                <Field label="No. HP (opsional)" error={fieldErrs.phone}>
                    <input
                        value={f.phone}
                        onChange={set('phone')}
                        placeholder="08xxxxxxxxxx"
                    />
                </Field>
            </Row>

            <Row>
                <Field label="Password" error={fieldErrs.password}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={f.password}
                            onChange={set('password')}
                            placeholder="••••••••"
                            style={{ flex: 1 }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            style={{ marginLeft: 8 }}
                        >
                            {showPassword ? '👁' : '👁'}
                        </button>
                    </div>
                </Field>

                <Field
                    label="Konfirmasi Password"
                    error={fieldErrs.confPassword}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type={showConfPassword ? 'text' : 'password'}
                            value={f.confPassword}
                            onChange={set('confPassword')}
                            placeholder="••••••••"
                            style={{ flex: 1 }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfPassword((s) => !s)}
                            style={{ marginLeft: 8 }}
                        >
                            {showConfPassword ? '👁' : '👁'}
                        </button>
                    </div>
                </Field>
            </Row>

            <Field label="Role" error={fieldErrs.role_id}>
                <select
                    value={f.role_id}
                    onChange={set('role_id')}
                    disabled={loadingRoles || rolesList.length === 0}
                >
                    <option value="">
                        {loadingRoles ? 'Memuat role…' : '— pilih role —'}
                    </option>
                    {rolesList.map((r) => (
                        <option key={r.id} value={String(r.id)}>
                            {r.name}
                        </option>
                    ))}
                </select>
            </Field>

            <div className="actions">
                <Button variant="primary" onClick={submit} disabled={loading}>
                    {loading ? 'Membuat...' : 'Buat User'}
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => {
                        setF(INIT);
                        setFieldErrs({});
                    }}
                    disabled={loading}
                >
                    Reset
                </Button>
            </div>
        </Card>
    );
}
