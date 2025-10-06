import React from 'react';
import AcademicYearForm from './components/AcademicYearForm';
import SemesterForm from './components/SemesterForm';
import ClassForm from './components/ClassForm';
import UserForm from './components/UserForm';
import TeacherSubjectLinker from './components/TeacherSubjectLinker';
import SubjectForm from './components/SubjectForm';
import RoomForm from './components/RoomForm';
import MiniListTable from './Components/MiniListTable';
import { AdminApi } from '../../../services/apiClient';

export default function MasterDataPage() {
    const miniRows = [
        { id: '1', type: 'Kelas', name: 'VII A', detail: 'Wali: Bu Sari' },
        { id: '2', type: 'Guru', name: 'Pak Budi', detail: 'NIP: 1980…' },
        { id: '3', type: 'Mapel', name: 'Matematika', detail: 'Kode: MTK' },
    ];

    return (
        <div className="grid cols-2">
            <AcademicYearForm />

            <SemesterForm
                onSubmit={async (p) => {
                    /* await AdminApi.createSemester(p);  */ alert(
                        'Semester ditambah',
                    );
                }}
            />
            <ClassForm
                teachers={[
                    { id: 1, name: 'Bu Sari' },
                    { id: 2, name: 'Pak Budi' },
                ]}
                onSubmit={async (p) => {
                    /* await AdminApi.createClass(p); */ alert(
                        'Kelas ditambah',
                    );
                }}
            />
            <UserForm />
            <TeacherSubjectLinker
                teachers={[
                    { id: 1, name: 'Pak Budi' },
                    { id: 2, name: 'Bu Sari' },
                ]}
                subjects={[
                    { id: 10, name: 'Matematika' },
                    { id: 11, name: 'Bahasa Indonesia' },
                ]}
                onLink={async (p) => {
                    /* await AdminApi.linkTeacherSubject(p); */ alert(
                        'Relasi ditambah',
                    );
                }}
            />
            <SubjectForm
                onCreate={async (p) => {
                    /* await AdminApi.createSubject(p); */ alert(
                        'Mapel ditambah',
                    );
                }}
            />
            <RoomForm
                onCreate={async (p) => {
                    /* await AdminApi.createRoom(p);    */ alert(
                        'Ruang ditambah',
                    );
                }}
            />
            <MiniListTable
                rows={miniRows}
                onEdit={(r) => alert('Edit ' + r.name)}
            />
        </div>
    );
}
