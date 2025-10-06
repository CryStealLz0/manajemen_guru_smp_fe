import { Button } from '../../../../../components/ui/Button';

export default function EditUserModal({
    open,
    edit,
    setEdit,
    roles,
    onClose,
    onSave,
}) {
    if (!open || !edit) return null;
    const set = (k) => (e) =>
        setEdit((s) => ({ ...s, [k]: e?.target?.value ?? '' }));

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: 16,
            }}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: 12,
                    minWidth: 420,
                    maxWidth: 640,
                    width: '100%',
                    boxShadow: '0 10px 30px rgba(0,0,0,.2)',
                }}
            >
                <div
                    style={{
                        padding: '14px 16px',
                        borderBottom: '1px solid #eee',
                        fontWeight: 600,
                    }}
                >
                    Edit User
                </div>

                <div style={{ padding: 16, display: 'grid', gap: 10 }}>
                    <Labeled label="Nama Lengkap">
                        <input
                            value={edit.full_name}
                            onChange={set('full_name')}
                            placeholder="Nama lengkap"
                        />
                    </Labeled>
                    <Labeled label="Username">
                        <input
                            value={edit.username}
                            onChange={set('username')}
                            placeholder="Username"
                        />
                    </Labeled>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 10,
                        }}
                    >
                        <Labeled label="Phone">
                            <input
                                value={edit.phone}
                                onChange={set('phone')}
                                placeholder="08xxxxxxxxxx"
                            />
                        </Labeled>
                        <Labeled label="NIP">
                            <input
                                value={edit.nip}
                                onChange={set('nip')}
                                placeholder="NIP"
                            />
                        </Labeled>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 10,
                        }}
                    >
                        <Labeled label="Role">
                            <select
                                value={edit.role_id}
                                onChange={set('role_id')}
                            >
                                <option value="">— pilih role —</option>
                                {roles.map((r) => (
                                    <option key={r.id} value={String(r.id)}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        </Labeled>
                        <Labeled label="Status">
                            <select
                                value={edit.status}
                                onChange={set('status')}
                            >
                                <option value="active">active</option>
                                <option value="inactive">inactive</option>
                                <option value="pending">pending</option>
                                <option value="banned">banned</option>
                            </select>
                        </Labeled>
                    </div>

                    <Labeled label="Password (opsional)">
                        <input
                            type="password"
                            value={edit.password}
                            onChange={set('password')}
                            placeholder="Kosongkan jika tidak diubah"
                        />
                    </Labeled>
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
                    <Button variant="ghost" onClick={onClose}>
                        Batal
                    </Button>
                    <Button variant="primary" onClick={onSave}>
                        Simpan
                    </Button>
                </div>
            </div>
        </div>
    );
}

function Labeled({ label, children }) {
    return (
        <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#374151' }}>{label}</span>
            {children}
        </label>
    );
}
