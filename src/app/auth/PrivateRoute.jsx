import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

/**
 * PrivateRoute
 * - roles: array of allowed roles, mis. ['admin'] atau ['teacher']
 * - redirectTo: path ketika belum login (default: '/login')
 * - fallback: elemen saat loading (default: teks sederhana)
 * - children: opsional; jika ada dipakai, kalau tidak ada akan render <Outlet />
 *
 * Contoh pakai:
 *  <Route element={<PrivateRoute roles={['admin']} />}>
 *    <Route path="/admin" element={<AdminDashboard />} />
 *  </Route>
 *
 *  // Atau sebagai wrapper:
 *  <PrivateRoute roles={['teacher']}>
 *    <TeacherDashboard />
 *  </PrivateRoute>
 */
export default function PrivateRoute({
    roles = [],
    redirectTo = '/login',
    fallback = <div style={{ padding: 24 }}>Memuat sesi…</div>,
    children,
}) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // 1) Masih cek sesi dari /auth/me
    if (loading) return fallback;

    // 2) Belum login → arahkan ke login sambil bawa 'from'
    if (!user) {
        return <Navigate to={redirectTo} replace state={{ from: location }} />;
    }

    // 3) Jika ada pembatasan role dan user tidak cocok → lempar ke dashboard sesuai rolenya
    if (
        Array.isArray(roles) &&
        roles.length > 0 &&
        !roles.includes(user.role)
    ) {
        const home = user.role === 'admin' ? '/admin' : '/teacher';
        return <Navigate to={home} replace />;
    }

    // 4) Lolos semua → render children (jika ada) atau Outlet untuk nested routes
    return children ?? <Outlet />;
}
