import React from 'react';
import Card from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Field, Row } from '../../../../components/ui/Form';
import ConfirmModal from '../../../../components/ui/ConfirmModal';

export default function SubjectForm({ onCreate }) {
    const [f, setF] = React.useState({ code: '', name: '', description: '' });
    const [modal, setModal] = React.useState({ isOpen: false, message: '' });

    const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
    const submit = async () => {
        if (!f.name.trim()) {
            setModal({ isOpen: true, message: 'Nama Mata Pelajaran wajib diisi.' });
            return;
        }
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
