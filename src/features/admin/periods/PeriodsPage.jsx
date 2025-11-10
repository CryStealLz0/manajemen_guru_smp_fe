import React from 'react';
import Card from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Field, Row } from '../../../components/ui/Form';
import { Table } from '../../../components/ui/Table';
import { AdminApi } from '../../../services/apiClient';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { useToast } from '../../../components/ui/ToastContext';

export default function PeriodsPage() {
    const [period, setPeriod] = React.useState({
        title: 'JP-1',
        start_time: '07:00',
        end_time: '07:40',
    });
    const [periods, setPeriods] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [modal, setModal] = React.useState({ isOpen: false, message: '' });
    const toast = useToast();

    const fetchPeriods = async () => {
        setLoading(true);
        try {
            const res = await AdminApi.getPeriods();
            if (res.ok) {
                setPeriods(res.data);
            }
        } catch (error) {
            toast?.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchPeriods();
    }, []);

    const set = (k) => (e) => setPeriod((s) => ({ ...s, [k]: e.target.value }));

    const submit = async () => {
        if (!period.title.trim()) {
            setModal({ isOpen: true, message: 'Judul JP wajib diisi.' });
            return;
        }
        if (!period.start_time || !period.end_time) {
            setModal({ isOpen: true, message: 'Waktu mulai dan waktu akhir wajib diisi.' });
            return;
        }
        if (period.start_time >= period.end_time) {
            setModal({ isOpen: true, message: 'Waktu mulai tidak boleh melebihi atau sama dengan waktu akhir.' });
            return;
        }

        try {
            await AdminApi.createPeriod(period);
            toast?.success('Period berhasil ditambah');
            setPeriod({ title: '', start_time: '', end_time: '' });
            fetchPeriods();
        } catch (error) {
            toast?.error(error.message);
        }
    };
    
    const cols = [
        { header: 'JP', key: 'title' },
        { header: 'Mulai', key: 'start_time' },
        { header: 'Akhir', key: 'end_time' },
    ];

    return (
        <div className="grid cols-2">
            <Card title="Definisi Jam Pelajaran (Periods)">
                <Row>
                    <Field label="Judul JP">
                        <input
                            value={period.title}
                            onChange={set('title')}
                        />
                    </Field>
                    <Field label="Mulai">
                        <input
                            type="time"
                            value={period.start_time}
                            onChange={set('start_time')}
                        />
                    </Field>
                    <Field label="Akhir">
                        <input
                            type="time"
                            value={period.end_time}
                            onChange={set('end_time')}
                        />
                    </Field>
                </Row>
                <div className="actions">
                    <Button variant="primary" onClick={submit}>Tambah Period</Button>
                    <Button variant="ghost" onClick={() => setPeriod({ title: '', start_time: '', end_time: '' })}>Reset</Button>
                </div>
                <p className="muted">
                    Validasi <span className="kbd">start &lt; end</span>{' '}
                    dilakukan di backend & frontend.
                </p>
            </Card>

            <Card title="Daftar Periods">
                <Table
                    columns={cols}
                    rows={periods}
                    loading={loading}
                    renderActions={() => (
                        <>
                            <Button>Edit</Button>{' '}
                            <Button variant="warn">Hapus</Button>
                        </>
                    )}
                />
                <div className="notice" style={{ marginTop: 10 }}>
                    Saran: tombol <b>“Generate JP-1..JP-8 default”</b> untuk
                    cepat setup awal.
                </div>
            </Card>
            <ConfirmModal
                open={modal.isOpen}
                title="Validasi Input"
                onClose={() => setModal({ isOpen: false, message: '' })}
                onConfirm={() => setModal({ isOpen: false, message: '' })}
                confirmText="OK"
            >
                {modal.message}
            </ConfirmModal>
        </div>
    );
}
