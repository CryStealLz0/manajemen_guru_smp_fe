import ProfileForm from './components/ProfileForm';
import { useProfile } from '../hooks/useProfile';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const { profile, loading, error, updateProfile, saving } = useProfile();
    const nav = useNavigate();

    if (loading) return <p>Memuat profil...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!profile) return <p>Profil tidak ditemukan</p>;

    const handleUpdate = async (payload) => {
        try {
            await updateProfile(payload);
            alert('Profil berhasil diperbarui');
        } catch (err) {
            alert('Gagal memperbarui profil: ' + err.message);
        }
    };

    const goToHome = () => {
        nav('/');
    };

    return (
        <div style={{ padding: '40px 10px' }}>
            <button
                style={{
                    display: 'flex',
                    margin: 'auto',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    border: 'none',
                    borderRadius: '4px',
                }}
                onClick={goToHome}
            >
                Kembali ke halaman utama
            </button>

            <div
                style={{
                    maxWidth: '500px',
                    margin: '40px auto',
                    padding: '16px',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
            >
                <h1
                    style={{
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: '600',
                        marginBottom: '16px',
                    }}
                >
                    Profil Saya
                </h1>

                <div
                    style={{
                        fontSize: '14px',
                        marginBottom: '16px',
                        lineHeight: 1.6,
                    }}
                >
                    <p>
                        <b>Nama Lengkap:</b> {profile.full_name || '-'}
                    </p>
                    <p>
                        <b>Username:</b> {profile.username || '-'}
                    </p>
                    <p>
                        <b>NIP:</b> {profile.nip || '-'}
                    </p>
                    <p>
                        <b>No. Telepon:</b> {profile.phone || '-'}
                    </p>

                    <p>
                        <b>Role:</b> {profile.role?.name || '-'}
                    </p>

                    <p>
                        <b>Status:</b> {profile.status || '-'}
                    </p>
                </div>

                <ProfileForm
                    user={profile}
                    onSubmit={handleUpdate}
                    saving={saving}
                />
            </div>
        </div>
    );
}
