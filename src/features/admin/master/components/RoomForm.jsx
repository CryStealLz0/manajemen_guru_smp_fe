import React from 'react';
import Card from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Field, Row } from '../../../../components/ui/Form';

export default function RoomForm({ onCreate }) {
    const [f, setF] = React.useState({ name: '', capacity: '', location: '' });
    const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
    const submit = async () => {
        await onCreate?.(f);
        setF({ name: '', capacity: '', location: '' });
    };

    return (
        <Card title="Ruang (opsional)">
            <Row>
                <Field label="Nama Ruang">
                    <input
                        value={f.name}
                        onChange={set('name')}
                        placeholder="R. 7A / Lab IPA"
                    />
                </Field>
                <Field label="Kapasitas">
                    <input
                        type="number"
                        value={f.capacity}
                        onChange={set('capacity')}
                        placeholder="40"
                    />
                </Field>
            </Row>
            <Field label="Lokasi (opsional)">
                <input
                    value={f.location}
                    onChange={set('location')}
                    placeholder="Gedung A Lantai 2"
                />
            </Field>
            <div className="actions">
                <Button onClick={submit}>Tambah Ruang</Button>
            </div>
        </Card>
    );
}
