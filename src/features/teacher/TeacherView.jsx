import React from 'react';
import { Tabs } from '../../components/ui/Tabs';
import MySchedulePage from './schedule/MySchedulePage';
import MyProfilePage from './profile/MyProfilePage';
import AcademicYearReadOnlySection from './achademics/AcademicYearReadOnlySection';

export default function TeacherView() {
    const [tab, setTab] = React.useState('schedule');

    const items = [
        { value: 'schedule', label: 'My Schedule' },
        { value: 'achademic', label: 'Achademic' },
        { value: 'profile', label: 'My Profile' },
    ];

    return (
        <div style={{ padding: 16 }}>
            <Tabs value={tab} onChange={setTab} items={items} />
            {tab === 'schedule' && <MySchedulePage />}
            {tab === 'achademic' && <AcademicYearReadOnlySection />}
            {tab === 'profile' && <MyProfilePage />}
        </div>
    );
}
