import { useState } from 'react';

export default function ProfileForm({ user, onSubmit, saving }) {
    const [form, setForm] = useState({
        full_name: user.full_name || '',
        username: user.username || '',
        phone: user.phone || '',
        nip: user.nip || '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    const inputStyle = {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
    };

    const labelStyle = {
        display: 'block',
        fontWeight: '500',
        marginBottom: '4px',
    };

    const fieldStyle = { marginBottom: '12px' };

    const buttonStyle = {
        display: 'flex',
        margin: 'auto',
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: saving ? 'not-allowed' : 'pointer',
        opacity: saving ? 0.6 : 1,
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={fieldStyle}>
                <label style={labelStyle}>Nama Lengkap</label>
                <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    style={inputStyle}
                />
            </div>

            <div style={fieldStyle}>
                <label style={labelStyle}>Username</label>
                <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    style={inputStyle}
                />
            </div>

            <div style={fieldStyle}>
                <label style={labelStyle}>Nomor Telepon</label>
                <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    style={inputStyle}
                />
            </div>

            <div style={fieldStyle}>
                <label style={labelStyle}>NIP</label>
                <input
                    type="text"
                    name="nip"
                    value={form.nip}
                    onChange={handleChange}
                    style={inputStyle}
                />
            </div>

            <div style={fieldStyle}>
                <label style={labelStyle}>Password Baru (opsional)</label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    style={inputStyle}
                />
            </div>

            <button disabled={saving} type="submit" style={buttonStyle}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
        </form>
    );
}
