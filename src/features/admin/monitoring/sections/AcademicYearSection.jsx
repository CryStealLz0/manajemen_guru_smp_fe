// src/pages/admin/monitoring/sections/AcademicYearSection.jsx
import React from 'react';
import { useToast } from '../../../../components/ui/ToastContext';
import ConfirmModal from '../../../../components/ui/ConfirmModal';
import { AdminApi } from '../../../../services/apiClient';
import useAcademicYears from '../hooks/useAcademicYears';
import AcademicYearTable from '../components/academicYears/AcademicYearTable';
import AcademicYearForm from '../../../admin/master/components/AcademicYearForm';
import EditAcademicYearModal from '../components/academicYears/EditAcademicYearModal';

export default function AcademicYearSection() {
    const toast = useToast();
    const { loading, years, err, meta, reload } = useAcademicYears({
        initialLimit: 5,
    });

    // --- Delete confirm ---
    const [confirm, setConfirm] = React.useState({
        open: false,
        target: null,
        loading: false,
    });
    const askDelete = (y) =>
        setConfirm({ open: true, target: y, loading: false });
    const closeConfirm = () => setConfirm((s) => ({ ...s, open: false }));

    const handleConfirmDelete = async () => {
        if (!confirm.target) return;
        try {
            setConfirm((s) => ({ ...s, loading: true }));
            await AdminApi.deleteAcademicYear(confirm.target.id);
            await reload({ page: meta.page, limit: meta.limit });
            toast?.success?.('Tahun ajaran berhasil dihapus');
            setConfirm({ open: false, target: null, loading: false });
        } catch (e) {
            toast?.error?.(e?.message || 'Gagal menghapus tahun ajaran');
            setConfirm((s) => ({ ...s, loading: false }));
        }
    };

    // --- Pagination ---
    const handlePageChange = (next) => {
        const clamped = Math.max(1, Math.min(next, meta.pages || 1));
        if (clamped !== meta.page) reload({ page: clamped, limit: meta.limit });
    };
    const handleLimitChange = (newLimit) => {
        if (newLimit !== meta.limit) reload({ page: 1, limit: newLimit });
    };

    // --- Create ---
    const handleCreate = async (payload) => {
        try {
            await AdminApi.createAcademicYear(payload);
            toast?.success?.('Tahun ajaran berhasil ditambahkan');
            await reload({ page: meta.page, limit: meta.limit });
        } catch (e) {
            toast?.error?.(e?.message || 'Gagal menambah tahun ajaran');
        }
    };

    // --- Edit ---
    const [editOpen, setEditOpen] = React.useState(false);
    const [edit, setEdit] = React.useState(null);
    const [savingEdit, setSavingEdit] = React.useState(false);

    const onClickEdit = (y) => {
        setEdit({
            id: y.id,
            name: y.name || '',
            start_date: y.start_date || '',
            end_date: y.end_date || '',
        });
        setEditOpen(true);
    };

    const onSaveEdit = async () => {
        if (!edit?.name?.trim())
            return toast?.error?.('Nama tahun ajaran wajib diisi');
        if (!edit?.start_date)
            return toast?.error?.('Tanggal mulai wajib diisi');
        if (!edit?.end_date) return toast?.error?.('Tanggal akhir wajib diisi');
        if (edit.start_date > edit.end_date) {
            return toast?.error?.('Tanggal akhir harus >= tanggal mulai');
        }

        try {
            setSavingEdit(true);
            await AdminApi.updateAcademicYear(edit.id, {
                name: edit.name.trim(),
                start_date: edit.start_date,
                end_date: edit.end_date,
            });
            await reload({ page: meta.page, limit: meta.limit });
            setEditOpen(false);
            setEdit(null);
            toast?.success?.('Tahun ajaran berhasil diperbarui');
        } catch (e) {
            toast?.error?.(e?.message || 'Gagal memperbarui tahun ajaran');
        } finally {
            setSavingEdit(false);
        }
    };

    return (
        <>
            <AcademicYearForm onSubmit={handleCreate} />

            <div style={{ height: 14 }}></div>

            <AcademicYearTable
                loading={loading}
                err={err}
                years={years}
                meta={meta}
                onReload={() => reload({ page: meta.page, limit: meta.limit })}
                onEdit={onClickEdit}
                onAskDelete={askDelete}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                showActions={true}
            />

            <EditAcademicYearModal
                open={editOpen}
                edit={edit}
                setEdit={setEdit}
                onClose={() => {
                    setEditOpen(false);
                    setEdit(null);
                }}
                onSave={onSaveEdit}
                saving={savingEdit}
            />

            <ConfirmModal
                open={confirm.open}
                title="Hapus Tahun Ajaran"
                message={
                    confirm.target
                        ? `Yakin mau hapus tahun ajaran "${confirm.target.name}"?`
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
