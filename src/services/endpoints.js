export const endpoints = {
    baseURL: '/api',
    semesters: '/semesters',
    schoolYears: '/school-years',
    classes: '/classes',
    teachers: '/teachers',
    subjects: '/subjects',
    rooms: '/rooms',
    periods: '/periods',
    schedule: '/schedule',
    previews: {
        byClass: (classId) => `/previews/class/${classId}`,
        byTeacher: (teacherId) => `/previews/teacher/${teacherId}`,
    },
};
