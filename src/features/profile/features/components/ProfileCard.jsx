export default function ProfileCard({ user }) {
    if (!user) return null;

    const cardStyle = {
        padding: '16px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    };

    const titleStyle = {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '8px',
    };

    const textStyle = { margin: '6px 0' };

    return (
        <div style={cardStyle}>
            <h2 style={titleStyle}>Profil Saya</h2>
            <p style={textStyle}>
                <b>Nama:</b> {user.full_name}
            </p>
            <p style={textStyle}>
                <b>Username:</b> {user.username}
            </p>
            <p style={textStyle}>
                <b>Telepon:</b> {user.phone || '-'}
            </p>
            <p style={textStyle}>
                <b>NIP:</b> {user.nip || '-'}
            </p>
            <p style={textStyle}>
                <b>Status:</b> {user.status}
            </p>
            <p style={textStyle}>
                <b>Role:</b> {user.role || '-'}
            </p>
        </div>
    );
}
