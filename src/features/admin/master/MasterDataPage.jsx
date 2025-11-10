import React from 'react';
import AcademicYearForm from './components/AcademicYearForm';
import SemesterForm from './components/SemesterForm';
import ClassForm from './components/ClassForm';
import UserForm from './components/UserForm';
import TeacherSubjectLinker from './components/TeacherSubjectLinker';
import SubjectForm from './components/SubjectForm';
import RoomForm from './components/RoomForm';
import { AdminApi } from '../../../services/apiClient';

export default function MasterDataPage() {
  const miniRows = [
    { id: '1', type: 'Kelas', name: 'VII A', detail: 'Wali: Bu Sari' },
    { id: '2', type: 'Guru', name: 'Pak Budi', detail: 'NIP: 1980…' },
    { id: '3', type: 'Mapel', name: 'Matematika', detail: 'Kode: MTK' },
  ];

  const [academicYears, setAcademicYears] = React.useState([]);
  const [teachers, setTeachers] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);

  React.useEffect(() => {
    AdminApi.getAcademicYears().then((res) => {
      if (res.ok) {
        setAcademicYears(res.data);
      }
    });
    AdminApi.getUsers({ role: 'teacher' }).then((res) => {
      if (res.ok) {
        setTeachers(res.data.map((t) => ({ id: t.id, name: t.full_name })));
      }
    });
    AdminApi.getSubjects().then((res) => {
      if (res.ok) {
        setSubjects(res.data);
      }
    });
  }, []);

  return (
    <div className="grid cols-2">
      <AcademicYearForm />

      <SemesterForm
        academicYears={academicYears}
        onSubmit={async (p) => {
          await AdminApi.createSemester(p);
          alert('Semester ditambah');
        }}
      />
      <ClassForm
        teachers={teachers}
        onSubmit={async (p) => {
          await AdminApi.createClass(p);
          alert('Kelas ditambah');
        }}
      />
      <UserForm />
      <TeacherSubjectLinker
        teachers={teachers}
        subjects={subjects}
        onLink={async (p) => {
          await AdminApi.linkTeacherSubject(p);
          alert('Relasi ditambah');
        }}
      />
      <SubjectForm
        onCreate={async (p) => {
          await AdminApi.createSubject(p);
          alert('Mapel ditambah');
        }}
      />
      <RoomForm
        onCreate={async (p) => {
          await AdminApi.createRoom(p);
          alert('Ruang ditambah');
        }}
      />
    </div>
  );
}
