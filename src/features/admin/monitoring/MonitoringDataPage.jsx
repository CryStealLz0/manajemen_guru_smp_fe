// src/pages/admin/monitoring/MonitoringDataPage.jsx
import React from 'react';
import Card from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

import UsersSection from './sections/UsersSection';
import AcademicYearSection from './sections/AcademicYearSection';

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
        </div>
    );
}
