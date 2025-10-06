import React from 'react';
import Card from '../../../components/ui/Card';
import { Field, Row } from '../../../components/ui/Form';
import { Table } from '../../../components/ui/Table';

export default function MySchedulePage() {
    const rows = [
        {
            id: 't1',
            jp: 'JP-1',
            waktu: '07:00–07:40',
            kelas: 'VII A',
            mapel: 'Matematika',
            ruang: 'R.7A',
            catatan: '-',
        },
        {
            id: 't2',
            jp: 'JP-2',
            waktu: '07:40–08:20',
            kelas: 'VII A',
            mapel: 'Bahasa Indonesia',
            ruang: '-',
            catatan: 'Ulangan',
        },
    ];

    const cols = [
        { header: 'JP', key: 'jp' },
        { header: 'Waktu', key: 'waktu' },
        { header: 'Kelas', key: 'kelas' },
        { header: 'Mapel', key: 'mapel' },
        { header: 'Ruang', key: 'ruang' },
        { header: 'Catatan', key: 'catatan' },
    ];

    return (
        <Card title="Jadwal Saya">
            <Row>
                <Field label="Semester">
                    <select defaultValue="2025/2026 - Ganjil" disabled>
                        <option>2025/2026 - Ganjil</option>
                    </select>
                </Field>
                <Field label="Hari">
                    <select defaultValue="Senin" disabled>
                        <option>Senin</option>
                        <option>Selasa</option>
                        <option>Rabu</option>
                        <option>Kamis</option>
                        <option>Jumat</option>
                        <option>Sabtu</option>
                    </select>
                </Field>
            </Row>

            <div style={{ marginTop: 8 }}>
                <Table columns={cols} rows={rows} />
            </div>

            <p className="muted" style={{ marginTop: 8 }}>
                Mode Guru bersifat <b>read-only</b>.
            </p>
        </Card>
    );
}
