import React, { Suspense } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet,
} from 'react-router-dom';
import Header from '../components/layout/Header';
import LoginPage from '../features/auth/LoginPage';
import PrivateRoute from './auth/PrivateRoute';
import { useAuth } from './auth/AuthProvider';
import ProfilePage from '../features/profile/features/ProfilePage';

const AdminView = React.lazy(() => import('../features/admin/AdminView'));
const TeacherView = React.lazy(() => import('../features/teacher/TeacherView'));

function AppShell() {
    return (
        <>
            <Header />
            <Suspense
                fallback={<div style={{ padding: 24 }}>Memuat halaman…</div>}
            >
                <Outlet />
            </Suspense>
        </>
    );
}

function HomeRedirect() {
    const { user, loading } = useAuth();
    if (loading) return <div style={{ padding: 24 }}>Memuat sesi…</div>;
    if (!user) return <Navigate to="/login" replace />;

    // Jika user.role adalah object (misal { name: 'admin' }), sesuaikan
    const roleName =
        typeof user.role === 'string' ? user.role : user.role?.name;

    return (
        <Navigate to={roleName === 'admin' ? '/admin' : '/teacher'} replace />
    );
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Private routes */}
                <Route
                    element={
                        <PrivateRoute
                            fallback={
                                <div style={{ padding: 24 }}>Memuat sesi…</div>
                            }
                        />
                    }
                >
                    <Route element={<AppShell />}>
                        <Route index element={<HomeRedirect />} />

                        {/* Admin-only */}
                        <Route element={<PrivateRoute roles={['admin']} />}>
                            <Route path="admin/*" element={<AdminView />} />
                        </Route>

                        {/* Teacher-only */}
                        <Route element={<PrivateRoute roles={['teacher']} />}>
                            <Route path="teacher/*" element={<TeacherView />} />
                        </Route>

                        {/* Profile: bisa diakses semua user login */}
                        <Route path="profile/*" element={<ProfilePage />} />
                    </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
