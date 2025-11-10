import React from 'react';
import Card from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Field, Row } from '../../../../components/ui/Form';
import ConfirmModal from '../../../../components/ui/ConfirmModal';

export default function SemesterForm({ academicYears = [], onSubmit }) {
    const [form, setForm] = React.useState({
        academic_year_id: academicYears[0]?.id || '',
        name: 'Ganjil',
        start_date: '',
        end_date: '',
    });
    const [modal, setModal] = React.useState({ isOpen: false, message: '' });

    React.useEffect(() => {
        if (academicYears.length > 0) {
            setForm(s => ({ ...s, academic_year_id: academicYears[0]?.id || '' }));
        }
    }, [academicYears]);

    const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

    const submit = async () => {
        if (!form.start_date || !form.end_date) {
            setModal({ isOpen: true, message: 'Tanggal mulai dan tanggal akhir wajib diisi.' });
            return;
        }
        if (new Date(form.start_date) > new Date(form.end_date)) {
            setModal({ isOpen: true, message: 'Tanggal mulai tidak boleh melebihi tanggal akhir.' });
            return;
        }

        const payload = {
            ...form,
        };
        await onSubmit?.(payload);
        setForm((s) => ({ ...s, start_date: '', end_date: '' }));
    };

    return (
        <Card title="Semester">
            <Row>
                <Field label="Tahun Ajaran">
                    <select
                        value={form.academic_year_id}
                        onChange={set('academic_year_id')}
                    >
                        {academicYears.map(y => (
                            <option key={y.id} value={y.id}>
                                {y.name}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="Semester">
                    <select value={form.name} onChange={set('name')}>
                        <option>Ganjil</option>
                        <option>Genap</option>
                    </select>
                </Field>
            </Row>
            <Row>
                <Field label="Mulai">
                    <input
                        type="date"
                        value={form.start_date}
                        onChange={set('start_date')}
                    />
                </Field>
                <Field label="Akhir">
                    <input
                        type="date"
                        value={form.end_date}
                        onChange={set('end_date')}
                    />
                </Field>
            </Row>
            <div className="actions">
                <Button variant="primary" onClick={submit}>
                    Tambah Semester
                </Button>
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
