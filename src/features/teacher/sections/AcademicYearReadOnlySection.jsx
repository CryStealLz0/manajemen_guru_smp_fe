import React from 'react';
import useAcademicYears from '../../admin/monitoring/hooks/useAcademicYears';
import AcademicYearTable from '../../admin/monitoring/components/academicYears/AcademicYearTable';

export default function AcademicYearReadOnlySection() {
    const { loading, years, err, meta, reload } = useAcademicYears({
        initialLimit: 5,
    });

    const handlePageChange = (next) => {
        const clamped = Math.max(1, Math.min(next, meta.pages || 1));
        if (clamped !== meta.page) reload({ page: clamped, limit: meta.limit });
    };

    const handleLimitChange = (newLimit) => {
        if (newLimit !== meta.limit) reload({ page: 1, limit: newLimit });
    };

    return (
        <AcademicYearTable
            loading={loading}
            err={err}
            years={years}
            meta={meta}
            onReload={() => reload({ page: meta.page, limit: meta.limit })}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            showActions={false}
        />
    );
}
