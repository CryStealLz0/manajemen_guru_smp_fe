// src/services/userApi.js
export async function createUser(payload) {
    const res = await fetch('http://localhost:5173/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    const text = await res.text();
    let json;
    try {
        json = text ? JSON.parse(text) : {};
    } catch {
        json = {};
    }

    if (!res.ok) {
        const err = new Error(json?.msg || `HTTP ${res.status}`);
        if (json?.errors) err.fieldErrors = json.errors;
        throw err;
    }

    return json?.data || { ...payload, id: json?.id, role_id: payload.role_id };
}
