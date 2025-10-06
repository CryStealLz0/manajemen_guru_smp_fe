export default function StatusBadge({ value }) {
    const bg =
        value === 'active'
            ? '#dcfce7'
            : value === 'banned'
            ? '#fee2e2'
            : '#e5e7eb';
    return (
        <span
            style={{
                padding: '2px 8px',
                borderRadius: 999,
                background: bg,
                fontSize: 12,
            }}
        >
            {value || 'active'}
        </span>
    );
}
