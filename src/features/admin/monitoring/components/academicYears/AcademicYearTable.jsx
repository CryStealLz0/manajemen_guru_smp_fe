// src/pages/admin/monitoring/components/AcademicYearTable.jsx
import { Button } from '../../../../../components/ui/Button';

const th = {
    textAlign: 'left',
    padding: '10px 12px',
    fontWeight: 600,
    borderBottom: '1px solid #eee',
};
const td = { padding: '10px 12px' };

export default function AcademicYearTable({
    loading,
    err,
    years,
    meta = { page: 1, limit: 5, total: 0, pages: 1 },
    onReload,
    onEdit,
    onAskDelete,
    onPageChange,
    onLimitChange,
    pageSizeOptions = [5, 10, 20, 50],
    showActions = false, // <-- default: tidak ada aksi (cocok untuk Teacher)
}) {
    const pageHasRows = years.length > 0;
    const start = pageHasRows ? (meta.page - 1) * meta.limit + 1 : 0;
    const end = pageHasRows ? (meta.page - 1) * meta.limit + years.length : 0;
    const hasPrev = meta.page > 1;
    const hasNext = meta.page < (meta.pages || 1);

    // hanya tampilkan kolom aksi jika diperbolehkan & memang ada handler
    const actionsEnabled = showActions && (!!onEdit || !!onAskDelete);
    const colCount = actionsEnabled ? 5 : 4;

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
                            <th style={th}>Tanggal Mulai</th>
                            <th style={th}>Tanggal Akhir</th>
                            {actionsEnabled && <th style={th}>Aksi</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={colCount}
                                    style={{ padding: 16, textAlign: 'center' }}
                                >
                                    Memuat data…
                                </td>
                            </tr>
                        ) : years.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={colCount}
                                    style={{ padding: 16, textAlign: 'center' }}
                                >
                                    {(meta?.total ?? 0) === 0
                                        ? 'Belum ada data Tahun Ajaran.'
                                        : 'Tidak ada data pada halaman ini. Coba kembali ke halaman 1.'}
                                </td>
                            </tr>
                        ) : (
                            years.map((y, i) => (
                                <tr
                                    key={y.id}
                                    style={{ borderTop: '1px solid #eee' }}
                                >
                                    <td style={td}>
                                        {(meta.page - 1) * meta.limit + (i + 1)}
                                    </td>
                                    <td style={td}>{y.name}</td>
                                    <td style={td}>{y.start_date}</td>
                                    <td style={td}>{y.end_date}</td>

                                    {actionsEnabled && (
                                        <td
                                            style={{
                                                ...td,
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            <Button
                                                variant="ghost"
                                                onClick={() => onEdit?.(y)}
                                            >
                                                Update
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                onClick={() => onAskDelete?.(y)}
                                                style={{
                                                    marginLeft: 6,
                                                    color: '#b91c1c',
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    )}
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
                    Menampilkan <strong>{start}</strong>–<strong>{end}</strong>{' '}
                    dari <strong>{meta.total}</strong> data
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>Rows per</span>
                    <select
                        value={meta.limit}
                        onChange={(e) =>
                            onLimitChange?.(Number(e.target.value))
                        }
                        disabled={loading}
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
                        disabled={loading || !hasPrev}
                        style={{ padding: '6px 10px' }}
                    >
                        Prev
                    </Button>
                    <span>
                        Page {meta.page} / {meta.pages || 1}
                    </span>
                    <Button
                        onClick={() => onPageChange?.(meta.page + 1)}
                        disabled={loading || !hasNext}
                        style={{ padding: '6px 10px' }}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </>
    );
}
