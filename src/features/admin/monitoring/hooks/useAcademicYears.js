// src/pages/admin/monitoring/hooks/useAcademicYears.js
import React from 'react';
import { AdminApi } from '../../../../services/apiClient';

export default function useAcademicYears({ initialLimit = 5 } = {}) {
    const [loading, setLoading] = React.useState(true);
    const [years, setYears] = React.useState([]);
    const [err, setErr] = React.useState('');
    const [meta, setMeta] = React.useState({
        page: 1,
        limit: initialLimit,
        total: 0,
        pages: 1,
    });

    const reload = React.useCallback(
        async ({ page = meta.page, limit = meta.limit } = {}) => {
            setLoading(true);
            setErr('');
            try {
                const res = await AdminApi.getAcademicYears({ page, limit });

                // ⬇️ perbaikan utama ada di sini
                const root =
                    res &&
                    typeof res === 'object' &&
                    ('meta' in res || 'ok' in res || 'msg' in res)
                        ? res
                        : res?.data ?? res;

                const list = Array.isArray(root?.data) ? root.data : [];
                const m = root?.meta ?? {};

                const toNum = (v) =>
                    Number.isFinite(Number(v)) ? Number(v) : undefined;
                const lim = toNum(m.limit) ?? limit ?? initialLimit;
                const pg = toNum(m.page) ?? page ?? 1;
                const total = toNum(m.total) ?? list.length;
                const pages =
                    toNum(m.pages) ??
                    Math.max(1, Math.ceil(total / (lim || 1)));

                setYears(list);
                setMeta({ page: pg, limit: lim, total, pages });
            } catch (e) {
                setErr(e?.message || 'Gagal memuat data');
            } finally {
                setLoading(false);
            }
        },
        [meta.page, meta.limit, initialLimit],
    );

    React.useEffect(() => {
        reload({ page: 1, limit: initialLimit });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialLimit]);

    return { loading, years, err, meta, reload, setYears, setMeta, setErr };
}
