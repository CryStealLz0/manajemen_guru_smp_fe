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
    me: () => api.get('/auth/me', { allow401: true }),
    logout: () => api.post('/auth/logout'),
};

// === Admin endpoints ===
export const AdminApi = {
    // Roles
    getRoles: (params) => api.get('/roles', { params }),

    // Users
    getUsers: (params) => api.get('/users', { params, allow401: true }),
    getUserById: (id) => api.get(`/users/${id}`, { allow401: true }),
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

    //Semesters
    getSemesters: (params) => api.get('/semesters', { params }),
    createSemester: (params) => api.post('/semesters',params),

    // Classes
    getClasses: (params) => api.get('/classes', { params }),
    createClass: (payload) => api.post('/classes', payload),

    // Subjects
    getSubjects: (params) => api.get('/subjects', { params }),
    createSubject: (payload) => api.post('/subjects', payload),

    // Teacher-Subjects
    linkTeacherSubject: (payload) => api.post('/teacher-subjects', payload),

    // Rooms
    getRooms: (params) => api.get('/rooms', { params }),
    createRoom: (payload) => api.post('/rooms', payload),

    // Periods
    getPeriods: (params) => api.get('/periods', { params }),
    createPeriod: (payload) => api.post('/periods', payload),

    // Timetables
    getTimetables: (params) => api.get('/timetables', { params }),
    createTimetable: (payload) => api.post('/timetables', payload),
};

// === Teacher endpoints ===
export const TeacherApi = {
    mySchedule: (semesterId, day) =>
        api.get('/teacher/me/schedule', { params: { semesterId, day } }),
    myProfile: () => api.get('/teacher/me', { allow401: true }),
};
