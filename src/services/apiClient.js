import { apiFetch } from './apiFetch';

// util kecil (biar mirip punyamu)
export const api = {
    get: (p, opts) => apiFetch(p, { ...opts, method: 'GET' }),
    post: (p, body, opts) => apiFetch(p, { ...opts, method: 'POST', body }),
    put: (p, body, opts) => apiFetch(p, { ...opts, method: 'PUT', body }),
    del: (p, opts) => apiFetch(p, { ...opts, method: 'DELETE' }),
};

// === Auth endpoints ===
export const AuthApi = {
    login: (payload) => api.post('/auth/login', payload),
    me: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
};

// === Admin endpoints ===
export const AdminApi = {
    // Roles
    getRoles: (params) => api.get('/roles', { params }),

    // Users
    getUsers: (params) => api.get('/users', { params }),
    getUserById: (id) => api.get(`/users/${id}`),
    createUser: (payload) => api.post('/users', payload),
    updateUser: (id, payload) => api.put(`/users/${id}`, payload),
    deleteUser: (id) => api.del(`/users/${id}`),

    // AcademicYears
    getAcademicYears: (params) => api.get('/academic-years', { params }),
    getAcademicYearById: (id) => api.get(`/academic-years/${id}`),
    createAcademicYear: (payload) => api.post('/academic-years', payload),
    updateAcademicYear: (id, payload) =>
        api.put(`/academic-years/${id}`, payload),
    deleteAcademicYear: (id) => api.delete(`/academic-years/${id}`),
};

// === Teacher endpoints ===
export const TeacherApi = {
    mySchedule: (semesterId, day) =>
        api.get('/teacher/me/schedule', { params: { semesterId, day } }),
    myProfile: () => api.get('/teacher/me'),
};
