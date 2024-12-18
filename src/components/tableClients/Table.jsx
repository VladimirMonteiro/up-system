// Table.jsx
import React, { useState } from 'react';
import styles from './Table.module.css';

const Table = ({ columns, data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    return sortedData;
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => {
                  const sorted = sortData(column.key);
                  // Display the sorted data in a table
                  // If needed, you can call a function here to update the state outside
                }}
                className={styles.sortableHeader}
              >
                {column.label}
                {sortConfig.key === column.key ? (
                  sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
