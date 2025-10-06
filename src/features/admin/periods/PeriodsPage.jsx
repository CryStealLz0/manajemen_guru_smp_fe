import React from 'react';
import Card from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Field, Row } from '../../../components/ui/Form';
import { Table } from '../../../components/ui/Table';

export default function PeriodsPage() {
    const [period, setPeriod] = React.useState({
        title: 'JP-1',
        start: '07:00',
        end: '07:40',
    });
    const rows = [
        { id: 'p1', title: 'JP-1', start: '07:00', end: '07:40' },
        { id: 'p2', title: 'JP-2', start: '07:40', end: '08:20' },
        { id: 'p3', title: 'JP-3', start: '08:30', end: '09:10' },
    ];
    const cols = [
        { header: 'JP', key: 'title' },
        { header: 'Mulai', key: 'start' },
        { header: 'Akhir', key: 'end' },
    ];
    return (
        <div className="grid cols-2">
            <Card title="Definisi Jam Pelajaran (Periods)">
                <Row>
                    <Field label="Judul JP">
                        <input
                            value={period.title}
                            onChange={(e) =>
                                setPeriod((s) => ({
                                    ...s,
                                    title: e.target.value,
                                }))
                            }
                        />
                    </Field>
                    <Field label="Mulai">
                        <input
                            type="time"
                            value={period.start}
                            onChange={(e) =>
                                setPeriod((s) => ({
                                    ...s,
                                    start: e.target.value,
                                }))
                            }
                        />
                    </Field>
                    <Field label="Akhir">
                        <input
                            type="time"
                            value={period.end}
                            onChange={(e) =>
                                setPeriod((s) => ({
                                    ...s,
                                    end: e.target.value,
                                }))
                            }
                        />
                    </Field>
                </Row>
                <div className="actions">
                    <Button variant="primary">Tambah Period</Button>
                    <Button variant="ghost">Reset</Button>
                </div>
                <p className="muted">
                    Validasi <span className="kbd">start &lt; end</span>{' '}
                    dilakukan di backend & frontend.
                </p>
            </Card>

            <Card title="Daftar Periods">
                <Table
                    columns={cols}
                    rows={rows}
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
        </div>
    );
}
