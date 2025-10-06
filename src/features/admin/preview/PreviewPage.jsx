import React from 'react';
import Card from '../../../components/ui/Card';
import { Field, Row } from '../../../components/ui/Form';
import { Table } from '../../../components/ui/Table';

export default function PreviewPage() {
    const classRows = [
        {
            id: 1,
            hari: 'Senin',
            jp: 'JP-1',
            waktu: '07:00–07:40',
            mapel: 'Matematika',
            guru: 'Pak Budi',
            ruang: 'R.7A',
        },
        {
            id: 2,
            hari: 'Senin',
            jp: 'JP-2',
            waktu: '07:40–08:20',
            mapel: 'B. Indonesia',
            guru: 'Bu Sari',
            ruang: '-',
        },
    ];
    const teacherRows = [
        {
            id: 1,
            hari: 'Senin',
            jp: 'JP-1',
            waktu: '07:00–07:40',
            kelas: 'VII A',
            mapel: 'Matematika',
            ruang: 'R.7A',
        },
        {
            id: 2,
            hari: 'Senin',
            jp: 'JP-2',
            waktu: '07:40–08:20',
            kelas: 'VII A',
            mapel: 'B. Indonesia',
            ruang: '-',
        },
    ];
    return (
        <div className="grid cols-2">
            <Card title="Preview per Kelas">
                <Row>
                    <Field label="Semester">
                        <select>
                            <option>2025/2026 - Ganjil</option>
                        </select>
                    </Field>
                    <Field label="Kelas">
                        <select>
                            <option>VII A</option>
                            <option>VII B</option>
                        </select>
                    </Field>
                </Row>
                <div style={{ marginTop: 8 }}>
                    <Table
                        columns={[
                            { header: 'Hari', key: 'hari' },
                            { header: 'JP', key: 'jp' },
                            { header: 'Waktu', key: 'waktu' },
                            { header: 'Mapel', key: 'mapel' },
                            { header: 'Guru', key: 'guru' },
                            { header: 'Ruang', key: 'ruang' },
                        ]}
                        rows={classRows}
                    />
                </div>
            </Card>

            <Card title="Preview per Guru">
                <Row>
                    <Field label="Semester">
                        <select>
                            <option>2025/2026 - Ganjil</option>
                        </select>
                    </Field>
                    <Field label="Guru">
                        <select>
                            <option>Pak Budi</option>
                            <option>Bu Sari</option>
                        </select>
                    </Field>
                </Row>
                <div style={{ marginTop: 8 }}>
                    <Table
                        columns={[
                            { header: 'Hari', key: 'hari' },
                            { header: 'JP', key: 'jp' },
                            { header: 'Waktu', key: 'waktu' },
                            { header: 'Kelas', key: 'kelas' },
                            { header: 'Mapel', key: 'mapel' },
                            { header: 'Ruang', key: 'ruang' },
                        ]}
                        rows={teacherRows}
                    />
                </div>
            </Card>
        </div>
    );
}
