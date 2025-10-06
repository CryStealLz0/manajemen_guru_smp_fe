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

// (opsional) lazy load halaman berat
const AdminView = React.lazy(() => import('../features/admin/AdminView'));
const TeacherView = React.lazy(() => import('../features/teacher/TeacherView'));

// Shell untuk halaman privat: selalu ada Header + Outlet konten
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

// Arahkan "/" ke dashboard sesuai role (tunggu loading biar tak flicker)
function HomeRedirect() {
    const { user, loading } = useAuth();
    if (loading) return <div style={{ padding: 24 }}>Memuat sesi…</div>;
    if (!user) return <Navigate to="/login" replace />;
    return (
        <Navigate to={user.role === 'admin' ? '/admin' : '/teacher'} replace />
    );
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public-only: tanpa Header */}
                <Route path="/login" element={<LoginPage />} />

                {/* Semua rute di bawah ini butuh login (PrivateRoute tanpa pembatasan role) */}
                <Route
                    element={
                        <PrivateRoute
                            fallback={
                                <div style={{ padding: 24 }}>Memuat sesi…</div>
                            }
                        />
                    }
                >
                    {/* AppShell menampilkan Header untuk halaman privat */}
                    <Route element={<AppShell />}>
                        {/* "/" otomatis ke dashboard sesuai role */}
                        <Route index element={<HomeRedirect />} />

                        {/* Admin-only */}
                        <Route element={<PrivateRoute roles={['admin']} />}>
                            <Route path="admin/*" element={<AdminView />} />
                        </Route>

                        {/* Teacher-only */}
                        <Route element={<PrivateRoute roles={['teacher']} />}>
                            <Route path="teacher/*" element={<TeacherView />} />
                        </Route>
                    </Route>
                </Route>

                {/* fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
