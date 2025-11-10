// src/pages/admin/monitoring/sections/TimetableSection.jsx
import React from 'react';
import { useToast } from '../../../../components/ui/ToastContext';
import { AdminApi } from '../../../../services/apiClient';

// --- util kecil ---
const DAY_LABEL = {
  1: 'Senin',
  2: 'Selasa',
  3: 'Rabu',
  4: 'Kamis',
  5: 'Jumat',
  6: 'Sabtu',
  7: 'Minggu',
};
const formatTime = (t) => t?.slice?.(0, 5) || t || '--:--';

// --- hook data timetables ---
function useTimetables() {
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState('');
  const [rows, setRows] = React.useState([]);

  const fetchAll = React.useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await AdminApi.getTimetables(); // GET /timetables
      const raw = Array.isArray(res?.data)
        ? res.data
        : res?.rows || res?.data?.data || res || [];

      const mapped = raw.map((r) => ({
        id: r.id,
        day: r.day_of_week,
        dayLabel: DAY_LABEL[r.day_of_week] || r.day_of_week,
        periodId: r.period_id,
        periodTitle: r?.period?.title || `P${r.period_id}`,
        start: r?.period?.start_time,
        end: r?.period?.end_time,
        timeRange: `${formatTime(r?.period?.start_time)}—${formatTime(
          r?.period?.end_time,
        )}`,
        className: r?.class?.name || `Kelas #${r.class_id}`,
        subjectName: r?.subject?.name || `Mapel #${r.subject_id}`,
        teacherName:
          r?.teacher?.full_name?.trim?.() ||
          r?.teacher?.username ||
          `Guru #${r.teacher_id}`,
        roomName: r?.room?.name || `Ruang #${r.room_id}`,
      }));

      setRows(mapped);
    } catch (e) {
      setErr(e?.message || 'Gagal memuat jadwal');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { loading, err, rows, reload: fetchAll };
}

// --- komponen utama ---
export default function TimetableSection() {
  const toast = useToast();
  const { loading, err, rows, reload } = useTimetables();

  // filter & sort states
  const [q, setQ] = React.useState('');
  const [fDay, setFDay] = React.useState('');
  const [fClass, setFClass] = React.useState('');
  const [fTeacher, setFTeacher] = React.useState('');
  const [fSubject, setFSubject] = React.useState('');

  const [sortBy, setSortBy] = React.useState('day_then_start_then_class');
  const [sortDir, setSortDir] = React.useState('asc'); // asc | desc

  const unique = React.useMemo(() => {
    const days = [...new Set(rows.map((r) => r.day))].sort((a, b) => a - b);
    const classes = [...new Set(rows.map((r) => r.className))].sort();
    const teachers = [...new Set(rows.map((r) => r.teacherName))].sort();
    const subjects = [...new Set(rows.map((r) => r.subjectName))].sort();
    return { days, classes, teachers, subjects };
  }, [rows]);

  // filtering
  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      const hitQ =
        !query ||
        r.className.toLowerCase().includes(query) ||
        r.teacherName.toLowerCase().includes(query) ||
        r.subjectName.toLowerCase().includes(query) ||
        r.roomName.toLowerCase().includes(query);
      const hitDay = !fDay || r.day === Number(fDay);
      const hitClass = !fClass || r.className === fClass;
      const hitTeacher = !fTeacher || r.teacherName === fTeacher;
      const hitSubject = !fSubject || r.subjectName === fSubject;
      return hitQ && hitDay && hitClass && hitTeacher && hitSubject;
    });
  }, [rows, q, fDay, fClass, fTeacher, fSubject]);

  // sorting (default: hari → jam mulai → kelas)
  const sorted = React.useMemo(() => {
    const base = [...filtered];
    const dir = sortDir === 'asc' ? 1 : -1;

    const cmp =
      {
        day_then_start_then_class: (a, b) =>
          a.day - b.day ||
          (a.start || '').localeCompare(b.start || '') ||
          a.className.localeCompare(b.className),
        day: (a, b) => a.day - b.day,
        start: (a, b) => (a.start || '').localeCompare(b.start || ''),
        className: (a, b) => a.className.localeCompare(b.className),
        subjectName: (a, b) => a.subjectName.localeCompare(b.subjectName),
        teacherName: (a, b) => a.teacherName.localeCompare(b.teacherName),
        roomName: (a, b) => a.roomName.localeCompare(b.roomName),
      }[sortBy] || ((a, b) => 0);

    base.sort((a, b) => cmp(a, b) * dir);
    return base;
  }, [filtered, sortBy, sortDir]);

  const onClickHeader = (key) => () => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  const resetFilters = () => {
    setQ('');
    setFDay('');
    setFClass('');
    setFTeacher('');
    setFSubject('');
    setSortBy('day_then_start_then_class');
    setSortDir('asc');
  };

  const caret = (key) =>
    sortBy === key ? (sortDir === 'asc' ? '▲' : '▼') : '';

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Jadwal Pelajaran
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() =>
              reload().then(() => toast?.success?.('Data berhasil diperbarui'))
            }
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            ⟳ Muat Ulang
          </button>
          <button
            onClick={resetFilters}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari kelas/guru/mapel/ruang…"
          className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <select
          value={fDay}
          onChange={(e) => setFDay(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300"
        >
          <option value="">Semua Hari</option>
          {unique.days.map((d) => (
            <option key={d} value={d}>
              {DAY_LABEL[d]}
            </option>
          ))}
        </select>
        <select
          value={fClass}
          onChange={(e) => setFClass(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300"
        >
          <option value="">Semua Kelas</option>
          {unique.classes.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={fTeacher}
          onChange={(e) => setFTeacher(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300"
        >
          <option value="">Semua Guru</option>
          {unique.teachers.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={fSubject}
          onChange={(e) => setFSubject(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300"
        >
          <option value="">Semua Mapel</option>
          {unique.subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Tabel */}
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-900">
            <tr>
              <th
                onClick={onClickHeader('day')}
                className="text-left px-4 py-2.5 font-semibold cursor-pointer select-none"
                title="Urutkan berdasarkan hari"
              >
                Hari {caret('day')}
              </th>
              <th
                onClick={onClickHeader('start')}
                className="text-left px-4 py-2.5 font-semibold cursor-pointer select-none"
                title="Urutkan berdasarkan jam mulai"
              >
                Jam {caret('start')}
              </th>
              <th
                onClick={onClickHeader('className')}
                className="text-left px-4 py-2.5 font-semibold cursor-pointer select-none"
                title="Urutkan berdasarkan kelas"
              >
                Kelas {caret('className')}
              </th>
              <th
                onClick={onClickHeader('subjectName')}
                className="text-left px-4 py-2.5 font-semibold cursor-pointer select-none"
                title="Urutkan berdasarkan mata pelajaran"
              >
                Mata Pelajaran {caret('subjectName')}
              </th>
              <th
                onClick={onClickHeader('teacherName')}
                className="text-left px-4 py-2.5 font-semibold cursor-pointer select-none"
                title="Urutkan berdasarkan guru"
              >
                Guru {caret('teacherName')}
              </th>
              <th
                onClick={onClickHeader('roomName')}
                className="text-left px-4 py-2.5 font-semibold cursor-pointer select-none"
                title="Urutkan berdasarkan ruangan"
              >
                Ruang {caret('roomName')}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center text-gray-500">
                  Memuat data…
                </td>
              </tr>
            ) : err ? (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center text-red-600">
                  {err}
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center text-gray-500">
                  Tidak ada jadwal yang cocok dengan filter.
                </td>
              </tr>
            ) : (
              sorted.map((r, i) => (
                <tr
                  key={r.id}
                  className={`${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  } hover:bg-gray-100/70 transition-colors`}
                >
                  <td className="px-4 py-2.5">{r.dayLabel}</td>
                  <td className="px-4 py-2.5">
                    <div className="font-medium">{r.periodTitle}</div>
                    <div className="text-xs text-gray-500">{r.timeRange}</div>
                  </td>
                  <td className="px-4 py-2.5">{r.className}</td>
                  <td className="px-4 py-2.5">{r.subjectName}</td>
                  <td className="px-4 py-2.5">{r.teacherName}</td>
                  <td className="px-4 py-2.5">{r.roomName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Hint sort default */}
      <p className="text-xs text-gray-500">
        Urutan bawaan: <b>Hari</b> → <b>Jam mulai</b> → <b>Kelas</b>. Klik judul
        kolom untuk mengubah urutan.
      </p>
    </div>
  );
}
