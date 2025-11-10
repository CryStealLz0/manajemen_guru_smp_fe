// src/pages/admin/monitoring/sections/TeacherSubjectSection.jsx
import React from 'react';
import { useToast } from '../../../../components/ui/ToastContext';
import { AdminApi } from '../../../../services/apiClient';

// === Hook: ambil data pivot guru - mapel ===
function useTeacherSubjects() {
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState('');
  const [rows, setRows] = React.useState([]);

  const fetchAll = React.useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await AdminApi.getTeacherSubjects(); // GET /teacher-subjects
      const data = Array.isArray(res?.data)
        ? res.data
        : res?.rows || res?.data?.data || res || [];

      // ringkas untuk tabel
      const mapped = data.map((r) => ({
        id: `${r.teacher_id}-${r.subject_id}`,
        teacherName:
          r?.teacher?.full_name?.trim?.() ||
          r?.teacher?.username ||
          `Guru #${r.teacher_id}`,
        subjectName: r?.subject?.name || `Mapel #${r.subject_id}`,
      }));
      setRows(mapped);
    } catch (e) {
      setErr(e?.message || 'Gagal memuat data guru & mata pelajaran');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { loading, err, rows, reload: fetchAll };
}

// === Komponen utama ===
export default function TeacherSubjectSection() {
  const toast = useToast();
  const { loading, err, rows, reload } = useTeacherSubjects();

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Relasi Guru & Mata Pelajaran
        </h3>
        <button
          onClick={() =>
            reload().then(() => toast?.success?.('Data berhasil diperbarui'))
          }
          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
        >
          ⟳ Muat Ulang
        </button>
      </div>

      {/* Tabel */}
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-900">
            <tr>
              <th className="text-left px-4 py-2.5 font-semibold">Guru</th>
              <th className="text-left px-4 py-2.5 font-semibold">
                Mata Pelajaran
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={2} className="px-4 py-3 text-center text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : err ? (
              <tr>
                <td colSpan={2} className="px-4 py-3 text-center text-red-600">
                  {err}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-3 text-center text-gray-500">
                  Belum ada data guru & mata pelajaran.
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr
                  key={r.id}
                  className={`${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  } hover:bg-gray-100/70 transition-colors`}
                >
                  <td className="px-4 py-2.5">{r.teacherName}</td>
                  <td className="px-4 py-2.5">{r.subjectName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
