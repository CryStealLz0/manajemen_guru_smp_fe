const BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:5000';
// const BASE = '';

export async function apiFetch(
    path,
    { method = 'GET', body, params, headers, allow401 = false } = {},
) {
    const url = new URL(path.startsWith('/') ? path : `/${path}`, BASE);
    if (params)
        for (const [k, v] of Object.entries(params)) {
            if (v !== undefined && v !== null)
                url.searchParams.set(k, String(v));
        }

    const res = await fetch(url.toString(), {
        method,
        headers: { 'Content-Type': 'application/json', ...(headers || {}) },
        body: body != null ? JSON.stringify(body) : undefined,
        credentials: 'include',
    });

    const text = await res.text();
    let json = null;
    try {
        json = text ? JSON.parse(text) : null;
    } catch {}

    if (!res.ok) {
        if (allow401 && res.status === 401)
            return { __status: 401, ...(json || {}) };
        const err = new Error(
            json?.message || json?.msg || `HTTP ${res.status}`,
        );
        err.status = res.status;
        if (json?.errors && typeof json.errors === 'object')
            err.fieldErrors = json.errors;
        err.raw = json ?? text ?? null;
        throw err;
    }
    return json ?? (text || null);
}
