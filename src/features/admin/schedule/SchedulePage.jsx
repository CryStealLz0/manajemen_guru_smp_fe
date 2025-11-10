import React from 'react';
import Card from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Field, Row } from '../../../components/ui/Form';
import { Table } from '../../../components/ui/Table';
import { AdminApi } from '../../../services/apiClient';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { useToast } from '../../../components/ui/ToastContext';

const days = [
    { id: 1, name: 'Senin' },
    { id: 2, name: 'Selasa' },
    { id: 3, name: 'Rabu' },
    { id: 4, name: 'Kamis' },
    { id: 5, name: 'Jumat' },
    { id: 6, name: 'Sabtu' },
    { id: 7, name: 'Minggu' },
];

export default function SchedulePage() {
    // Data for dropdowns
    const [semesters, setSemesters] = React.useState([]);
    const [classes, setClasses] = React.useState([]);
    const [periods, setPeriods] = React.useState([]);
    const [subjects, setSubjects] = React.useState([]);
    const [teachers, setTeachers] = React.useState([]);
    const [rooms, setRooms] = React.useState([]);

    // Form state
    const [form, setForm] = React.useState({
        semester_id: '',
        day_of_week: '1',
        class_id: '',
        period_id: '',
        subject_id: '',
        teacher_id: '',
        room_id: '',
        notes: '',
    });

    // Table state
    const [timetable, setTimetable] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    // UI state
    const [modal, setModal] = React.useState({ isOpen: false, message: '' });
    const toast = useToast();

    const setF = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

    // Fetch initial data for dropdowns
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    semestersRes,
                    classesRes,
                    periodsRes,
                    subjectsRes,
                    teachersRes,
                    roomsRes,
                ] = await Promise.all([
                    AdminApi.getSemesters(),
                    AdminApi.getClasses(),
                    AdminApi.getPeriods(),
                    AdminApi.getSubjects(),
                    AdminApi.getUsers({ role: 'teacher' }),
                    AdminApi.getRooms(),
                ]);
                setSemesters(semestersRes.data);
                setClasses(classesRes.data);
                setPeriods(periodsRes.data);
                setSubjects(subjectsRes.data);
                setTeachers(teachersRes.data);
                setRooms(roomsRes.data);

                // Set initial form values
                if (semestersRes.data.length > 0) setForm(s => ({ ...s, semester_id: semestersRes.data[0].id }));
                if (classesRes.data.length > 0) setForm(s => ({ ...s, class_id: classesRes.data[0].id }));

            } catch (error) {
                toast?.error(error.message);
            }
        };
        fetchData();
    }, [toast]);

    // Fetch timetable data when filters change
    React.useEffect(() => {
        const fetchTimetable = async () => {
            if (!form.semester_id || !form.day_of_week || !form.class_id) {
                setTimetable([]);
                return;
            }
            setLoading(true);
            try {
                const res = await AdminApi.getTimetables({
                    semester_id: form.semester_id,
                    day_of_week: form.day_of_week,
                    class_id: form.class_id,
                });
                if (res.ok) {
                    setTimetable(res.data);
                }
            } catch (error) {
                toast?.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTimetable();
    }, [form.semester_id, form.day_of_week, form.class_id, toast]);

    const submit = async () => {
        const { semester_id, day_of_week, class_id, period_id, subject_id, teacher_id } = form;
        if (!semester_id || !day_of_week || !class_id || !period_id || !subject_id || !teacher_id) {
            setModal({ isOpen: true, message: 'Semua field wajib diisi, kecuali Ruang dan Catatan.' });
            return;
        }

        try {
            await AdminApi.createTimetable({
                ...form,
                room_id: form.room_id || null,
            });
            toast?.success('Jadwal berhasil disimpan');
            // Refetch timetable
            const res = await AdminApi.getTimetables({
                semester_id: form.semester_id,
                day_of_week: form.day_of_week,
                class_id: form.class_id,
            });
            if (res.ok) {
                setTimetable(res.data);
            }
        } catch (error) {
            toast?.error(error.message);
        }
    };

    const cols = [
        { header: 'JP', key: 'period.title' },
        { header: 'Waktu', key: 'period.start_time', render: (row) => `${row.period.start_time} - ${row.period.end_time}` },
        { header: 'Mapel', key: 'subject.name' },
        { header: 'Guru', key: 'teacher.full_name' },
        { header: 'Ruang', key: 'room.name' },
        { header: 'Catatan', key: 'notes' },
    ];

    return (
        <div className="grid cols-2">
            <Card title="Susun Jadwal (Create Timetable)">
                <Row>
                    <Field label="Semester">
                        <select value={form.semester_id} onChange={setF('semester_id')}>
                            {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </Field>
                    <Field label="Hari">
                        <select value={form.day_of_week} onChange={setF('day_of_week')}>
                            {days.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </Field>
                    <Field label="Kelas">
                        <select value={form.class_id} onChange={setF('class_id')}>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </Field>
                </Row>

                <Row>
                    <Field label="Period (JP)">
                        <select value={form.period_id} onChange={setF('period_id')}>
                            <option value="">— pilih JP —</option>
                            {periods.map(p => <option key={p.id} value={p.id}>{p.title} ({p.start_time}-{p.end_time})</option>)}
                        </select>
                    </Field>
                    <Field label="Mata Pelajaran">
                        <select value={form.subject_id} onChange={setF('subject_id')}>
                            <option value="">— pilih mapel —</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </Field>
                    <Field label="Guru">
                        <select value={form.teacher_id} onChange={setF('teacher_id')}>
                            <option value="">— pilih guru —</option>
                            {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
                        </select>
                    </Field>
                </Row>

                <Row>
                    <Field label="Ruang (opsional)">
                        <select value={form.room_id} onChange={setF('room_id')}>
                            <option value="">— pilih ruang —</option>
                            {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </Field>
                    <Field label="Catatan (opsional)">
                        <input
                            value={form.notes}
                            onChange={setF('notes')}
                            placeholder="Ulangan harian / pindah ruang / guru pengganti…"
                        />
                    </Field>
                </Row>

                <div className="actions">
                    <Button variant="success" onClick={submit}>Simpan Jadwal</Button>
                    <Button variant="ghost" onClick={() => setForm(s => ({ ...s, period_id: '', subject_id: '', teacher_id: '', room_id: '', notes: '' }))}>Reset</Button>
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
                            {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </Field>
                    <Field label="Ke Semester">
                        <select>
                            {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
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
                            {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
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
                    rows={timetable}
                    loading={loading}
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
