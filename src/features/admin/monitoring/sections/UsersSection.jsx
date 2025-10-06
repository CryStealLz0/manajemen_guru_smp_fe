// src/pages/admin/monitoring/sections/UsersSection.jsx
import React from 'react';
import { useToast } from '../../../../components/ui/ToastContext';
import ConfirmModal from '../../../../components/ui/ConfirmModal';
import { AdminApi } from '../../../../services/apiClient';

import useUsers from '../hooks/useUsers';
import MonitoringUsersTable from '../components/users/MonitoringUsersTable';
import EditUserModal from '../components/users/EditUserModal';

export default function UsersSection() {
    const toast = useToast();
    const { loading, users, roles, err, meta, reload } = useUsers({
        initialLimit: 5,
    });

    const [editOpen, setEditOpen] = React.useState(false);
    const [edit, setEdit] = React.useState(null);

    const [confirm, setConfirm] = React.useState({
        open: false,
        target: null,
        loading: false,
    });

    const onClickEdit = (u) => {
        setEdit({
            id: u.id,
            full_name: u.full_name || '',
            username: u.username || '',
            phone: u.phone || '',
            nip: u.nip || '',
            role_id: String(u.role_id ?? ''),
            status: u.status || 'active',
            password: '',
        });
        setEditOpen(true);
    };

    const askDelete = (u) =>
        setConfirm({ open: true, target: u, loading: false });
    const closeConfirm = () => setConfirm((s) => ({ ...s, open: false }));

    const handleConfirmDelete = async () => {
        if (!confirm.target) return;
        try {
            setConfirm((s) => ({ ...s, loading: true }));
            await AdminApi.deleteUser(confirm.target.id);

            // bila halaman jadi kosong, mundur 1 halaman
            if (users.length === 1 && meta.page > 1) {
                await reload({ page: meta.page - 1, limit: meta.limit });
            } else {
                await reload({ page: meta.page, limit: meta.limit });
            }

            toast?.success?.('User berhasil dihapus');
            setConfirm({ open: false, target: null, loading: false });
        } catch (e) {
            toast?.error?.(e?.message || 'Gagal menghapus user');
            setConfirm((s) => ({ ...s, loading: false }));
        }
    };

    const toUpdatePayload = (form) => {
        const p = {
            full_name: String(form.full_name ?? '').trim(),
            username: String(form.username ?? '').trim(),
            phone: String(form.phone ?? '').trim(),
            nip: String(form.nip ?? '').trim(),
            status: String(form.status ?? '').trim() || undefined,
        };
        if (form.role_id) p.role_id = Number(form.role_id);
        if (form.password && form.password.length > 0)
            p.password = form.password;
        return p;
    };

    const onSaveEdit = async () => {
        if (!edit.full_name.trim())
            return toast?.error?.('Nama lengkap wajib diisi');
        if (!edit.username.trim())
            return toast?.error?.('Username wajib diisi');

        try {
            const payload = toUpdatePayload(edit);
            await AdminApi.updateUser(edit.id, payload);
            await reload({ page: meta.page, limit: meta.limit });
            setEditOpen(false);
            setEdit(null);
            toast?.success?.('User berhasil diperbarui');
        } catch (e) {
            const fe = e?.fieldErrors;
            if (fe && typeof fe === 'object') {
                const first = Object.values(fe)[0];
                toast?.error?.(Array.isArray(first) ? first[0] : String(first));
            } else {
                toast?.error?.(e?.message || 'Gagal memperbarui user');
            }
        }
    };

    const handlePageChange = (next) => {
        const clamped = Math.max(1, Math.min(next, meta.pages || 1));
        if (clamped !== meta.page) reload({ page: clamped, limit: meta.limit });
    };
    const handleLimitChange = (newLimit) => {
        if (newLimit !== meta.limit) reload({ page: 1, limit: newLimit });
    };

    return (
        <>
            <MonitoringUsersTable
                loading={loading}
                err={err}
                users={users}
                roles={roles}
                meta={meta}
                onReload={() => reload({ page: meta.page, limit: meta.limit })}
                onEdit={onClickEdit}
                onAskDelete={askDelete}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />

            <EditUserModal
                open={editOpen}
                edit={edit}
                setEdit={setEdit}
                roles={roles}
                onClose={() => {
                    setEditOpen(false);
                    setEdit(null);
                }}
                onSave={onSaveEdit}
            />

            <ConfirmModal
                open={confirm.open}
                title="Hapus User"
                message={
                    confirm.target
                        ? `Yakin mau hapus user "${confirm.target.username}"? Tindakan ini tidak bisa dibatalkan.`
                        : ''
                }
                confirmText="Hapus"
                cancelText="Batal"
                danger
                loading={confirm.loading}
                onConfirm={handleConfirmDelete}
                onClose={closeConfirm}
            />
        </>
    );
}
