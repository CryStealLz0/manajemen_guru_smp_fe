import React from 'react';

export function Table({ columns, rows, renderActions }) {
    return (
        <div className="table-wrap">
            <table>
                <thead>
                    <tr>
                        {columns.map((c) => (
                            <th key={c.key || c.header}>{c.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={r.id ?? i}>
                            {columns.map((c) => (
                                <td key={c.key || c.header}>
                                    {c.render ? c.render(r) : r[c.key]}
                                </td>
                            ))}
                            {renderActions && <td>{renderActions(r)}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
