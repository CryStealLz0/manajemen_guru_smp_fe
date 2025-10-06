import React from 'react';
import Card from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Field, Row } from '../../../../components/ui/Form';

export default function SubjectForm({ onCreate }) {
    const [f, setF] = React.useState({ code: '', name: '', description: '' });
    const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
    const submit = async () => {
        await onCreate?.(f);
        setF({ code: '', name: '', description: '' });
    };

    return (
        <Card title="Mata Pelajaran">
            <Row>
                <Field label="Kode (opsional)">
                    <input
                        value={f.code}
                        onChange={set('code')}
                        placeholder="MTK / BIND / IPA"
                    />
                </Field>
                <Field label="Nama Mapel">
                    <input
                        value={f.name}
                        onChange={set('name')}
                        placeholder="Matematika"
                    />
                </Field>
            </Row>
            <Field label="Deskripsi">
                <textarea
                    value={f.description}
                    onChange={set('description')}
                    placeholder="Keterangan singkat mapel…"
                />
            </Field>
            <div className="actions">
                <Button variant="primary" onClick={submit}>
                    Tambah Mapel
                </Button>
                <Button
                    variant="ghost"
                    onClick={() =>
                        setF({ code: '', name: '', description: '' })
                    }
                >
                    Reset
                </Button>
            </div>
        </Card>
    );
}
