import React from 'react';
import Card from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Field, Row } from '../../../../components/ui/Form';
import { useToast } from '../../../../components/ui/ToastContext';
import { AdminApi } from '../../../../services/apiClient';

export default function AcademicYearForm({ onCreate }) {
    const toast = useToast();

    const [loading, setLoading] = React.useState(false);
    const [fieldErrs, setFieldErrs] = React.useState({});

    const INIT = {
        name: '',
        start_date: '',
        end_date: '',
    };
    const [f, setF] = React.useState(INIT);

    const set = (k) => (e) => {
        const v = e?.target?.value ?? '';
        setF((s) => ({ ...s, [k]: v }));
        setFieldErrs((errs) => ({ ...errs, [k]: undefined }));
    };

    const validate = () => {
        const errs = {};
        if (!f.name?.trim()) errs.name = 'Nama tahun ajaran wajib diisi';
        if (!f.start_date) errs.start_date = 'Tanggal mulai wajib diisi';
        if (!f.end_date) errs.end_date = 'Tanggal akhir wajib diisi';
        if (f.start_date && f.end_date && f.start_date > f.end_date) {
            errs.end_date = 'Tanggal akhir harus ≥ tanggal mulai';
        }
        setFieldErrs(errs);
        return Object.keys(errs).length === 0;
    };

    const toPayload = () => ({
        name: f.name.trim(),
        start_date: f.start_date,
        end_date: f.end_date,
    });

    const submit = async () => {
        if (loading) return;
        setFieldErrs({});

        if (!validate()) {
            toast.error('Periksa kembali input kamu.');
            return;
        }

        try {
            setLoading(true);
            const creator =
                onCreate || ((payload) => AdminApi.createAcademicYear(payload));
            const res = await creator(toPayload()); // harapannya return { msg, data }
            toast.success(res?.msg || 'Tahun ajaran berhasil dibuat');
            setF(INIT); // reset form
        } catch (e) {
            if (e?.fieldErrors && typeof e.fieldErrors === 'object') {
                setFieldErrs(e.fieldErrors);
            }
            toast.error(e?.message || 'Gagal membuat tahun ajaran');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="Buat Tahun Ajaran">
            <Row>
                <Field label="Nama Tahun Ajaran" error={fieldErrs.name}>
                    <input
                        value={f.name}
                        onChange={set('name')}
                        placeholder="2025/2026"
                    />
                </Field>
                <Field label="Tanggal Mulai" error={fieldErrs.start_date}>
                    <input
                        type="date"
                        value={f.start_date}
                        onChange={set('start_date')}
                    />
                </Field>
            </Row>

            <Row>
                <Field label="Tanggal Akhir" error={fieldErrs.end_date}>
                    <input
                        type="date"
                        value={f.end_date}
                        onChange={set('end_date')}
                    />
                </Field>
            </Row>

            <div className="actions">
                <Button variant="primary" onClick={submit} disabled={loading}>
                    {loading ? 'Membuat...' : 'Simpan Tahun Ajaran'}
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => {
                        setF(INIT);
                        setFieldErrs({});
                    }}
                    disabled={loading}
                >
                    Reset
                </Button>
            </div>
        </Card>
    );
}
