// src/pages/admin/monitoring/MonitoringDataPage.jsx
import React from 'react';
import Card from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

import UsersSection from './sections/UsersSection';
import AcademicYearSection from './sections/AcademicYearSection';
import TeacherSubjectSection from './sections/TeacherSubjectSection';
import TimetableSection from './sections/TimetableSection';

export default function MonitoringDataPage() {
  const [tab, setTab] = React.useState('users');

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <Button
          variant={tab === 'users' ? 'default' : 'ghost'}
          onClick={() => setTab('users')}
        >
          Users
        </Button>
        <Button
          variant={tab === 'years' ? 'default' : 'ghost'}
          onClick={() => setTab('years')}
        >
          Academic Years
        </Button>
        <Button
          variant={tab === 'teacherSubjects' ? 'default' : 'ghost'}
          onClick={() => setTab('teacherSubjects')}
        >
          Teacher Subjects
        </Button>
        <Button
          variant={tab === 'timetables' ? 'default' : 'ghost'}
          onClick={() => setTab('timetables')}
        >
          Timetables
        </Button>
      </div>

      {tab === 'users' && (
        <Card title="Monitoring Data — Users">
          <UsersSection />
        </Card>
      )}

      {tab === 'years' && (
        <Card title="Monitoring Data — Academic Years">
          <AcademicYearSection />
        </Card>
      )}

      {tab === 'teacherSubjects' && (
        <Card title="Monitoring Data — Teacher Subjects">
          <TeacherSubjectSection />
        </Card>
      )}
      {tab === 'timetables' && (
        <Card title="Monitoring Data — Timetables">
          <TimetableSection />
        </Card>
      )}
    </div>
  );
}
