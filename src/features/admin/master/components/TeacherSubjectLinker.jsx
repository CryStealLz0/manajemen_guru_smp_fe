import React from 'react';
import Card from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Field, Row } from '../../../../components/ui/Form';
import ConfirmModal from '../../../../components/ui/ConfirmModal';

export default function TeacherSubjectLinker({
    teachers = [],
    subjects = [],
    onLink,
}) {
    const [sel, setSel] = React.useState({ teacherId: '', subjectId: '' });
    const [modal, setModal] = React.useState({ isOpen: false, message: '' });

    const set = (k) => (e) => setSel((s) => ({ ...s, [k]: e.target.value }));
    const submit = async () => {
        if (!sel.teacherId || !sel.subjectId) {
            setModal({ isOpen: true, message: 'Guru dan Mata Pelajaran wajib dipilih.' });
            return;
        }
        const payload = {
            teacher_id: Number(sel.teacherId),
            subject_id: Number(sel.subjectId),
        };
        await onLink?.(payload);
        setSel({ teacherId: '', subjectId: '' });
    };

    return (
        <Card title="Relasi Guru ↔ Mapel">
            <Row>
                <Field label="Guru">
                    <select value={sel.teacherId} onChange={set('teacherId')}>
                        <option value="">— pilih guru —</option>
                        {teachers.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="Mapel">
                    <select value={sel.subjectId} onChange={set('subjectId')}>
                        <option value="">— pilih mapel —</option>
                        {subjects.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                </Field>
            </Row>
            <div className="actions">
                <Button onClick={submit}>Tambah Relasi</Button>
            </div>
            <ConfirmModal
                open={modal.isOpen}
                title="Validasi Input"
                onClose={() => setModal({ isOpen: false, message: '' })}
                onConfirm={() => setModal({ isOpen: false, message: '' })}
                confirmText="OK"
            >
                {modal.message}
            </ConfirmModal>
        </Card>
    );
}
