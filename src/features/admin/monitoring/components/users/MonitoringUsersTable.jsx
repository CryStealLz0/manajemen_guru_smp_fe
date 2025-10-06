// src/pages/admin/monitoring/components/MonitoringUsersTable.jsx
import { Button } from '../../../../../components/ui/Button';
import StatusBadge from './StatusBadge';

const th = {
    textAlign: 'left',
    padding: '10px 12px',
    fontWeight: 600,
    borderBottom: '1px solid #eee',
};
const td = { padding: '10px 12px' };

export default function MonitoringUsersTable({
    loading,
    err,
    users,
    roles,
    meta = { page: 1, limit: 5, total: 0, pages: 1 },
    onReload,
    onEdit,
    onAskDelete,
    onPageChange,
    onLimitChange,
    pageSizeOptions = [5, 10, 20, 50],
}) {
    const roleName = (id, fallback) =>
        fallback ?? roles.find((r) => String(r.id) === String(id))?.name ?? '-';

    const pageHasRows = users.length > 0;
    const start = pageHasRows ? (meta.page - 1) * meta.limit + 1 : 0;
    const end = pageHasRows ? (meta.page - 1) * meta.limit + users.length : 0;
    const hasPrev = meta.page > 1;
    const hasNext = meta.page < (meta.pages || 1);

    return (
        <>
            <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
                <Button variant="ghost" onClick={onReload} disabled={loading}>
                    {loading ? 'Memuat…' : 'Reload'}
                </Button>
            </div>

            {err && (
                <div style={{ color: '#b91c1c', marginBottom: 12 }}>{err}</div>
            )}

            <div style={{ overflowX: 'auto' }}>
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        border: '1px solid #eee',
                    }}
                >
                    <thead>
                        <tr style={{ background: '#f8fafc' }}>
                            <th style={th}>#</th>
                            <th style={th}>Nama</th>
                            <th style={th}>Username</th>
                            <th style={th}>Phone</th>
                            <th style={th}>NIP</th>
                            <th style={th}>Role</th>
                            <th style={th}>Status</th>
                            <th style={th}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    style={{ padding: 16, textAlign: 'center' }}
                                >
                                    Memuat data…
                                </td>
                            </tr>
                        ) : meta.total === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    style={{ padding: 16, textAlign: 'center' }}
                                >
                                    Belum ada data user.
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    style={{ padding: 16, textAlign: 'center' }}
                                >
                                    Tidak ada data pada halaman ini. Coba
                                    kembali ke halaman 1.
                                </td>
                            </tr>
                        ) : (
                            users.map((u, i) => (
                                <tr
                                    key={u.id}
                                    style={{ borderTop: '1px solid #eee' }}
                                >
                                    <td style={td}>
                                        {(meta.page - 1) * meta.limit + (i + 1)}
                                    </td>
                                    <td style={td}>{u.full_name}</td>
                                    <td style={td}>{u.username}</td>
                                    <td style={td}>{u.phone || '-'}</td>
                                    <td style={td}>{u.nip || '-'}</td>
                                    <td style={td}>
                                        {roleName(u.role_id, u.role?.name)}
                                    </td>
                                    <td style={td}>
                                        <StatusBadge value={u.status} />
                                    </td>
                                    <td style={{ ...td, whiteSpace: 'nowrap' }}>
                                        <Button
                                            variant="ghost"
                                            onClick={() => onEdit?.(u)}
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => onAskDelete?.(u)}
                                            disabled={!onAskDelete}
                                            style={{
                                                marginLeft: 6,
                                                color: '#b91c1c',
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div
                style={{
                    marginTop: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    flexWrap: 'wrap',
                }}
            >
                <div style={{ color: '#374151' }}>
                    Menampilkan <strong>{start || 0}</strong>–
                    <strong>{end || 0}</strong> dari{' '}
                    <strong>{meta.total || 0}</strong> data
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>Rows per</span>
                    <select
                        value={meta.limit}
                        onChange={(e) =>
                            onLimitChange?.(Number(e.target.value))
                        }
                        disabled={loading || !onLimitChange}
                    >
                        {pageSizeOptions.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                    <span>page</span>

                    <Button
                        onClick={() => onPageChange?.(meta.page - 1)}
                        disabled={loading || !hasPrev || !onPageChange}
                        style={{ padding: '6px 10px' }}
                    >
                        Prev
                    </Button>
                    <span>
                        Page {meta.page} / {meta.pages || 1}
                    </span>
                    <Button
                        onClick={() => onPageChange?.(meta.page + 1)}
                        disabled={loading || !hasNext || !onPageChange}
                        style={{ padding: '6px 10px' }}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </>
    );
}
