import React from 'react';
import Card from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Field, Row } from '../../../components/ui/Form';
import { Table } from '../../../components/ui/Table';

export default function SchedulePage() {
    const [filters, setFilters] = React.useState({
        semester: '2025/2026 - Ganjil',
        day: '1',
        classId: 'VII A',
        period: 'JP-1 (07:00-07:40)',
        subject: 'Matematika',
        teacher: 'Pak Budi',
        room: '',
        note: '',
    });

    const rows = [
        {
            id: 's1',
            jp: 'JP-1',
            time: '07:00–07:40',
            kelas: 'VII A',
            mapel: 'Matematika',
            guru: 'Pak Budi',
            ruang: 'R. 7A',
            catatan: '-',
        },
        {
            id: 's2',
            jp: 'JP-2',
            time: '07:40–08:20',
            kelas: 'VII A',
            mapel: 'Bahasa Indonesia',
            guru: 'Bu Sari',
            ruang: '-',
            catatan: 'Ulangan',
        },
    ];
    const cols = [
        { header: 'JP', key: 'jp' },
        { header: 'Waktu', key: 'time' },
        { header: 'Kelas', key: 'kelas' },
        { header: 'Mapel', key: 'mapel' },
        { header: 'Guru', key: 'guru' },
        { header: 'Ruang', key: 'ruang' },
        { header: 'Catatan', key: 'catatan' },
    ];

    return (
        <div className="grid cols-2">
            <Card title="Susun Jadwal (Create Timetable)">
                <Row>
                    <Field label="Semester">
                        <select
                            value={filters.semester}
                            onChange={(e) =>
                                setFilters((s) => ({
                                    ...s,
                                    semester: e.target.value,
                                }))
                            }
                        >
                            <option>2025/2026 - Ganjil</option>
                            <option>2025/2026 - Genap</option>
                        </select>
                    </Field>
                    <Field label="Hari">
                        <select
                            value={filters.day}
                            onChange={(e) =>
                                setFilters((s) => ({
                                    ...s,
                                    day: e.target.value,
                                }))
                            }
                        >
                            <option value="1">Senin</option>
                            <option value="2">Selasa</option>
                            <option value="3">Rabu</option>
                            <option value="4">Kamis</option>
                            <option value="5">Jumat</option>
                            <option value="6">Sabtu</option>
                        </select>
                    </Field>
                    <Field label="Kelas">
                        <select
                            value={filters.classId}
                            onChange={(e) =>
                                setFilters((s) => ({
                                    ...s,
                                    classId: e.target.value,
                                }))
                            }
                        >
                            <option>VII A</option>
                            <option>VII B</option>
                        </select>
                    </Field>
                </Row>

                <Row>
                    <Field label="Period (JP)">
                        <select
                            value={filters.period}
                            onChange={(e) =>
                                setFilters((s) => ({
                                    ...s,
                                    period: e.target.value,
                                }))
                            }
                        >
                            <option>JP-1 (07:00-07:40)</option>
                            <option>JP-2 (07:40-08:20)</option>
                        </select>
                    </Field>
                    <Field label="Mata Pelajaran">
                        <select
                            value={filters.subject}
                            onChange={(e) =>
                                setFilters((s) => ({
                                    ...s,
                                    subject: e.target.value,
                                }))
                            }
                        >
                            <option>Matematika</option>
                            <option>Bahasa Indonesia</option>
                        </select>
                    </Field>
                    <Field label="Guru">
                        <select
                            value={filters.teacher}
                            onChange={(e) =>
                                setFilters((s) => ({
                                    ...s,
                                    teacher: e.target.value,
                                }))
                            }
                        >
                            <option>Pak Budi</option>
                            <option>Bu Sari</option>
                        </select>
                    </Field>
                </Row>

                <Row>
                    <Field label="Ruang (opsional)">
                        <select
                            value={filters.room}
                            onChange={(e) =>
                                setFilters((s) => ({
                                    ...s,
                                    room: e.target.value,
                                }))
                            }
                        >
                            <option value="">—</option>
                            <option>R. 7A</option>
                            <option>Lab IPA</option>
                        </select>
                    </Field>
                    <Field label="Catatan (opsional)">
                        <input
                            value={filters.note}
                            onChange={(e) =>
                                setFilters((s) => ({
                                    ...s,
                                    note: e.target.value,
                                }))
                            }
                            placeholder="Ulangan harian / pindah ruang / guru pengganti…"
                        />
                    </Field>
                </Row>

                <div className="actions">
                    <Button variant="success">Simpan Jadwal</Button>
                    <Button variant="ghost">Reset</Button>
                </div>

                <div className="notice" style={{ marginTop: 10 }}>
                    Saat simpan, backend harus menolak <b>bentrok</b>{' '}
                    (kelas/guru/ruang pada slot sama).
                </div>
            </Card>

            <Card title="Duplikasi Jadwal Semester">
                <Row>
                    <Field label="Dari Semester">
                        <select>
                            <option>2025/2026 - Ganjil</option>
                        </select>
                    </Field>
                    <Field label="Ke Semester">
                        <select>
                            <option>2025/2026 - Genap</option>
                        </select>
                    </Field>
                </Row>
                <div className="actions">
                    <Button>Duplikat Semua Jadwal</Button>
                </div>
                <p className="muted">
                    Setelah duplikasi, admin bisa mengubah sebagian slot (misal
                    ganti guru).
                </p>
                <div className="divider" />
                <h4 style={{ margin: '6px 0' }}>Hapus Jadwal per Semester</h4>
                <Row>
                    <Field label="Semester">
                        <select>
                            <option>2025/2026 - Genap</option>
                        </select>
                    </Field>
                    <div className="actions" style={{ alignItems: 'end' }}>
                        <Button variant="warn">
                            Hapus Semua Jadwal Semester
                        </Button>
                    </div>
                </Row>
            </Card>

            <Card title="Ringkasan Jadwal (Hari terpilih)">
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
                <p className="muted" style={{ marginTop: 6 }}>
                    Filter atas menentukan isi tabel ini.
                </p>
            </Card>
        </div>
    );
}
