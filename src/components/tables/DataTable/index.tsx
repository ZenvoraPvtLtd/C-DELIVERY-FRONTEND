import React from 'react';
import styles from './DataTable.module.css';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyState?: React.ReactNode;
}

export function DataTable<T>({ columns, data, emptyState }: DataTableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <div className={styles.container}>{emptyState}</div>;
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={styles.th}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={styles.tr}>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={styles.td}>
                  {typeof col.accessor === 'function' 
                    ? col.accessor(row) 
                    : (row[col.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
