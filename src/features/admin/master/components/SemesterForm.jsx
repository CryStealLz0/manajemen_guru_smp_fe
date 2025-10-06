import React from 'react';
import Card from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Field, Row } from '../../../../components/ui/Form';

export default function SemesterForm({ onSubmit }) {
    const [form, setForm] = React.useState({
        type: 'Ganjil',
        startDate: '',
        endDate: '',
    });
    const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

    const submit = async () => {
        await onSubmit?.(form);
        setForm((s) => ({ ...s, startDate: '', endDate: '' }));
    };

    return (
        <Card title="Semester">
            <Row>
                <Field label="Semester">
                    <select value={form.type} onChange={set('type')}>
                        <option>Ganjil</option>
                        <option>Genap</option>
                    </select>
                </Field>
                <Field label="Mulai">
                    <input
                        type="date"
                        value={form.startDate}
                        onChange={set('startDate')}
                    />
                </Field>
                <Field label="Akhir">
                    <input
                        type="date"
                        value={form.endDate}
                        onChange={set('endDate')}
                    />
                </Field>
            </Row>
            <div className="actions">
                <Button variant="primary" onClick={submit}>
                    Tambah Semester
                </Button>
            </div>
        </Card>
    );
}
