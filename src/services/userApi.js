import { api } from './apiClient';

// src/services/userApi.js
export async function createUser(payload) {
    const json = await api.post('/users', payload);
    return json?.data || { ...payload, id: json?.id, role_id: payload.role_id };
}
