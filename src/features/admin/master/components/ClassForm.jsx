import React from 'react';
import Card from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Field, Row } from '../../../../components/ui/Form';
import ConfirmModal from '../../../../components/ui/ConfirmModal';

export default function ClassForm({ teachers = [], onSubmit }) {
    const [form, setForm] = React.useState({
        grade: 'VII',
        section: 'A',
        name: '',
        homeroomId: '',
    });
    const [showModal, setShowModal] = React.useState(false);

    const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));
    const submit = async () => {
        if (!form.name.trim()) {
            setShowModal(true);
            return;
        }

        const payload = {
            grade_level: form.grade,
            section: form.section,
            name: form.name,
            homeroom_teacher_id: form.homeroomId ? Number(form.homeroomId) : null,
        };
        await onSubmit?.(payload);
        setForm({ grade: 'VII', section: 'A', name: '', homeroomId: '' });
    };

    return (
        <Card title="Kelas / Rombel">
            <Row>
                <Field label="Jenjang">
                    <select value={form.grade} onChange={set('grade')}>
                        <option>VII</option>
                        <option>VIII</option>
                        <option>IX</option>
                    </select>
                </Field>
                <Field label="Rombel">
                    <select value={form.section} onChange={set('section')}>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                    </select>
                </Field>
            </Row>
            <Field label="Nama Kelas">
                <input
                    placeholder="VII A"
                    value={form.name}
                    onChange={set('name')}
                />
            </Field>
            <Field label="Wali Kelas (opsional)">
                <select value={form.homeroomId} onChange={set('homeroomId')}>
                    <option value="">— pilih guru —</option>
                    {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.name}
                        </option>
                    ))}
                </select>
            </Field>
            <div className="actions">
                <Button variant="primary" onClick={submit}>
                    Tambah Kelas
                </Button>
                <Button
                    variant="ghost"
                    onClick={() =>
                        setForm({
                            grade: 'VII',
                            section: 'A',
                            name: '',
                            homeroomId: '',
                        })
                    }
                >
                    Reset
                </Button>
            </div>

            <ConfirmModal
                open={showModal}
                title="Validasi Input"
                onClose={() => setShowModal(false)}
                onConfirm={() => setShowModal(false)}
                confirmText="OK"
            >
                Nama Kelas wajib diisi.
            </ConfirmModal>
        </Card>
    );
}
