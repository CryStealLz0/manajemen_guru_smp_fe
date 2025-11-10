import React from 'react';
import { Tabs } from '../../components/ui/Tabs';
import MasterDataPage from './master/MasterDataPage';
import PeriodsPage from './periods/PeriodsPage';
import SchedulePage from './schedule/SchedulePage';
import MonitoringDataPage from './monitoring/MonitoringDataPage';

export default function AdminView() {
  const [sub, setSub] = React.useState('master');
  const items = [
    { value: 'master', label: 'Master Data' },
    { value: 'monitoring', label: 'Monitoring Data' },
    { value: 'periods', label: 'Jam Pelajaran' },
    { value: 'schedule', label: 'Susun Jadwal' },
  ];
  return (
    <>
      <div style={{ padding: 16 }}>
        <Tabs value={sub} onChange={setSub} items={items} />
        {sub === 'master' && <MasterDataPage />}
        {sub === 'monitoring' && <MonitoringDataPage />}
        {sub === 'periods' && <PeriodsPage />}
        {sub === 'schedule' && <SchedulePage />}
      </div>
    </>
  );
}
