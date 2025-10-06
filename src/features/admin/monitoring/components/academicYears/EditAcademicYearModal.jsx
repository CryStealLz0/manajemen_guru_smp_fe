// src/pages/admin/monitoring/components/EditAcademicYearModal.jsx
import React from 'react';
import Modal from '../../../../../components/ui/Modal';
import { Button } from '../../../../../components/ui/Button';
import { Field, Row } from '../../../../../components/ui/Form';

export default function EditAcademicYearModal({
    open,
    edit, // { id, name, start_date, end_date }
    setEdit,
    onClose,
    onSave, // async function
    saving = false, // optional: show loading state
}) {
    if (!open) return null;

    const set = (k) => (e) => setEdit((s) => ({ ...s, [k]: e.target.value }));

    const handleSave = async () => {
        // Validasi sederhana
        if (!edit?.name?.trim()) return alert('Nama tahun ajaran wajib diisi');
        if (!edit?.start_date) return alert('Tanggal mulai wajib diisi');
        if (!edit?.end_date) return alert('Tanggal akhir wajib diisi');
        if (edit.start_date > edit.end_date) {
            return alert('Tanggal akhir harus >= tanggal mulai');
        }
        await onSave?.();
    };

    return (
        <Modal open={open} onClose={onClose} title="Edit Tahun Ajaran">
            <div style={{ display: 'grid', gap: 12 }}>
                <Row>
                    <Field label="Nama Tahun Ajaran">
                        <input
                            placeholder="2025/2026"
                            value={edit?.name || ''}
                            onChange={set('name')}
                        />
                    </Field>
                    <Field label="Tanggal Mulai">
                        <input
                            type="date"
                            value={edit?.start_date || ''}
                            onChange={set('start_date')}
                        />
                    </Field>
                    <Field label="Tanggal Akhir">
                        <input
                            type="date"
                            value={edit?.end_date || ''}
                            onChange={set('end_date')}
                        />
                    </Field>
                </Row>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 8,
                    }}
                >
                    <Button variant="ghost" onClick={onClose} disabled={saving}>
                        Batal
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Menyimpan…' : 'Simpan Perubahan'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
