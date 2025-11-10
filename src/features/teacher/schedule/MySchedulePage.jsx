// src/pages/teacher/MySchedulePage.jsx
import React from 'react';
import Card from '../../../components/ui/Card';
import { Field, Row } from '../../../components/ui/Form';
import { Table } from '../../../components/ui/Table';
import { AdminApi, AuthApi } from '../../../services/apiClient';
import { useAuth } from '../../../app/auth/AuthProvider';

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

/* --------- Hook: daftar semester untuk dropdown --------- */
function useSemesters() {
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState('');
  const [items, setItems] = React.useState([]);

  const fetchAll = React.useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await AdminApi.getSemesters();
      const data = Array.isArray(res?.data)
        ? res.data
        : res?.rows || res?.data?.data || res || [];

      const mapped = data.map((s) => {
        const ay =
          s?.academic_year?.name ||
          s?.academicYear?.name ||
          s?.academic_year_name ||
          '';
        const label = ay
          ? `${ay} - ${s?.name}`
          : s?.name || `Semester #${s?.id}`;
        return { id: s.id, label };
      });

      setItems(mapped);
    } catch (e) {
      setErr(e?.message || 'Gagal memuat semester');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { loading, err, items };
}

/* ------------------ Halaman utama ------------------ */
export default function MySchedulePage() {
  const { user: ctxUser, setUser } = useAuth?.() ?? {
    user: null,
    setUser: () => {},
  };
  const [me, setMe] = React.useState(ctxUser);

  // Pastikan ada user.id (kalau context belum terisi)
  React.useEffect(() => {
    let mounted = true;
    const ensureMe = async () => {
      try {
        if (!ctxUser?.id) {
          const res = await AuthApi.me(); // { id, username, role_id, ... }
          const u = res?.data || res;
          if (mounted) {
            setMe(u);
            setUser?.(u);
          }
        } else {
          setMe(ctxUser);
        }
      } catch {}
    };
    ensureMe();
    return () => {
      mounted = false;
    };
  }, [ctxUser, setUser]);

  const { items: semesters, loading: semLoading, err: semErr } = useSemesters();

  const [semesterId, setSemesterId] = React.useState('');
  const [day, setDay] = React.useState('1'); // default Senin
  React.useEffect(() => {
    if (semesters.length && !semesterId) setSemesterId(semesters[0].id);
  }, [semesters, semesterId]);

  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState('');
  const [rows, setRows] = React.useState([]);

  // 🔁 Ambil dari /timetables dengan filter teacher_id + semester_id + day_of_week
  const fetchSchedule = React.useCallback(async () => {
    if (!me?.id || !semesterId || !day) return;
    setLoading(true);
    setErr('');
    try {
      const res = await AdminApi.getTimetables({
        teacher_id: me.id,
        semester_id: semesterId,
        day_of_week: Number(day),
      });

      const data = Array.isArray(res?.data)
        ? res.data
        : res?.rows || res?.data?.data || res || [];

      const mapped = data
        .map((r) => ({
          id: r?.id,
          _start: r?.period?.start_time || '',
          jp: r?.period?.title || `JP-${r?.period_id}`,
          waktu: `${formatTime(r?.period?.start_time)}–${formatTime(
            r?.period?.end_time,
          )}`,
          kelas: r?.class?.name || `Kelas #${r?.class_id}`,
          mapel: r?.subject?.name || `Mapel #${r?.subject_id}`,
          ruang: r?.room?.name || '-',
          catatan: r?.notes || '-',
        }))
        .sort((a, b) => (a._start || '').localeCompare(b._start || ''));

      setRows(mapped);
    } catch (e) {
      setErr(e?.message || 'Gagal memuat jadwal');
    } finally {
      setLoading(false);
    }
  }, [me?.id, semesterId, day]);

  React.useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const cols = [
    { header: 'JP', key: 'jp' },
    { header: 'Waktu', key: 'waktu' },
    { header: 'Kelas', key: 'kelas' },
    { header: 'Mapel', key: 'mapel' },
    { header: 'Ruang', key: 'ruang' },
    { header: 'Catatan', key: 'catatan' },
  ];

  return (
    <Card
      title="Jadwal Saya"
      extra={
        <button
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
          onClick={fetchSchedule}
          disabled={!me?.id || !semesterId || !day}
        >
          ⟳ Muat Ulang
        </button>
      }
    >
      <Row>
        <Field label="Semester">
          <select
            value={semesterId}
            onChange={(e) => setSemesterId(e.target.value)}
            disabled={semLoading || !!semErr}
          >
            {semLoading && <option value="">Memuat…</option>}
            {semErr && <option value="">Gagal memuat semester</option>}
            {!semLoading &&
              !semErr &&
              semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
          </select>
        </Field>

        <Field label="Hari">
          <select value={day} onChange={(e) => setDay(e.target.value)}>
            {[1, 2, 3, 4, 5, 6].map((d) => (
              <option key={d} value={d}>
                {DAY_LABEL[d]}
              </option>
            ))}
          </select>
        </Field>
      </Row>

      <div style={{ marginTop: 8 }}>
        {!me?.id ? (
          <div className="muted">Masuk sebagai guru untuk melihat jadwal.</div>
        ) : loading ? (
          <div className="muted">Memuat jadwal…</div>
        ) : err ? (
          <div className="text-red-600">{err}</div>
        ) : rows.length === 0 ? (
          <div className="muted">Belum ada jadwal pada hari ini.</div>
        ) : (
          <Table columns={cols} rows={rows} />
        )}
      </div>

      <p className="muted" style={{ marginTop: 8 }}>
        Mode Guru bersifat <b>read-only</b>.
      </p>
    </Card>
  );
}
