import React from 'react';
import { AdminApi } from '../../../../services/apiClient';

export default function useUsers({ initialLimit = 5 } = {}) {
    const [loading, setLoading] = React.useState(true);
    const [users, setUsers] = React.useState([]);
    const [roles, setRoles] = React.useState([]);
    const [err, setErr] = React.useState('');

    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(initialLimit);
    const [meta, setMeta] = React.useState({
        page: 1,
        limit: initialLimit,
        total: 0,
        pages: 1,
    });

    // parser respons yang robust
    const extractListAndMeta = (resObj, p, l) => {
        // ambil langsung dari response, bukan auto .data dulu
        const list = Array.isArray(resObj?.data) ? resObj.data : [];
        const m = resObj?.meta ?? {};

        const n = (v) => (Number.isFinite(Number(v)) ? Number(v) : undefined);
        const lim = n(m.limit) ?? l;
        const pg = n(m.page) ?? p;
        const total = n(m.total) ?? list.length;
        const pages = n(m.pages) ?? Math.max(1, Math.ceil(total / lim));

        return { list, meta: { page: pg, limit: lim, total, pages } };
    };

    const reload = React.useCallback(
        async ({ page: p = page, limit: l = limit } = {}) => {
            const ac = new AbortController();
            setLoading(true);
            setErr('');

            try {
                const [uRes, rRes] = await Promise.all([
                    AdminApi.getUsers({ page: p, limit: l }),
                    AdminApi.getRoles(),
                ]);

                if (ac.signal.aborted) return;

                const { list, meta: m } = extractListAndMeta(uRes, p, l);

                // clamp page kalau server balikin di luar range
                const clampedPage = Math.max(1, Math.min(m.page, m.pages || 1));
                const rolesRoot = rRes?.data ?? rRes;
                const rolesList = Array.isArray(rolesRoot?.data)
                    ? rolesRoot.data
                    : Array.isArray(rolesRoot)
                    ? rolesRoot
                    : [];

                setUsers(list);
                setRoles(rolesList);
                setMeta({ ...m, page: clampedPage });
                setPage(clampedPage);
                setLimit(m.limit);
            } catch (e) {
                setErr(e?.message || 'Gagal memuat data');
                // boleh dihapus kalau nggak mau lempar ke caller:
                // throw e;
            } finally {
                if (!ac.signal.aborted) setLoading(false);
            }

            return () => ac.abort();
        },
        [page, limit],
    );

    // load pertama
    React.useEffect(() => {
        reload({ page: 1, limit: initialLimit });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialLimit]);

    return {
        loading,
        users,
        roles,
        err,
        page,
        limit,
        meta,
        setUsers,
        setRoles,
        setPage,
        setLimit,
        reload,
        setErr,
    };
}
