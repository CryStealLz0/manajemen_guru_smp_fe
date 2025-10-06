import React from 'react';
import Card from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Table } from '../../../../components/ui/Table';
import Pill from '../../../../components/ui/Pill';

export default function MiniListTable({ rows = [], onEdit }) {
    const columns = [
        { header: 'Tipe', render: (r) => <Pill>{r.type}</Pill> },
        { header: 'Nama', key: 'name' },
        { header: 'Detail', key: 'detail' },
    ];
    return (
        <Card
            title="Daftar Data Ringkas"
            subtitle="*Contoh ringkas untuk validasi input cepat."
        >
            <Table
                columns={columns}
                rows={rows}
                renderActions={(r) => (
                    <Button onClick={() => onEdit?.(r)}>Edit</Button>
                )}
            />
        </Card>
    );
}
