import React from 'react';

export interface ObsidianTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    headers: React.ReactNode[];
    data: React.ReactNode[][];
    emptyMessage?: React.ReactNode;
}

export const ObsidianTable: React.FC<ObsidianTableProps> = ({
    headers,
    data,
    emptyMessage = "No data available",
    className = '',
    ...props
}) => {
    return (
        <div className="obsidian-table-wrapper">
            <table className={`obsidian-table ${className}`} {...props}>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={headers.length} style={{ textAlign: 'center', padding: 'var(--obsidian-space-8)' }}>
                                <div className="obsidian-empty">
                                    <div className="obsidian-empty__description">{emptyMessage}</div>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ObsidianTable;
