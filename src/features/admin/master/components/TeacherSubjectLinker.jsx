import React from 'react';
import Card from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Field, Row } from '../../../../components/ui/Form';

export default function TeacherSubjectLinker({
    teachers = [],
    subjects = [],
    onLink,
}) {
    const [sel, setSel] = React.useState({ teacherId: '', subjectId: '' });
    const set = (k) => (e) => setSel((s) => ({ ...s, [k]: e.target.value }));
    const submit = async () => {
        await onLink?.(sel);
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
        </Card>
    );
}
