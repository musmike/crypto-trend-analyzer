import React, { useState } from 'react';
import styles from './CryptoTable.module.css';

const CryptoTable = ({ cryptocurrencyData }) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const cryptocurrencies = Array.from(new Set(cryptocurrencyData.map(data => data.symbol)));
  const timestamps = Array.from(new Set(cryptocurrencyData.map(data => data.timestamp)));
  timestamps.sort((a, b) => new Date(a) - new Date(b));

  const getPrice = (symbol, timestamp) => {
    const data = cryptocurrencyData.find(item => item.symbol === symbol && item.timestamp === timestamp);
    return data ? data.value : null;
  };

  const handleChangePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.cryptoTable}>
        <thead>
          <tr>
            <th>Timestamp</th>
            {cryptocurrencies.map(crypto => (
              <th key={crypto}>{crypto}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timestamps.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map(timestamp => (
            <tr key={timestamp}>
              <td>{timestamp}</td>
              {cryptocurrencies.map(crypto => (
                <td key={crypto}>{getPrice(crypto, timestamp)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <label className={styles.rowsPerPageLabel}>
          Rows per page:{' '}
          <select value={rowsPerPage} onChange={(e) => setRowsPerPage(parseInt(e.target.value))} className={styles.rowsPerPageSelect}>
            <option value={10}>10</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </label>
        <div className={styles.pageNavigation}>
          <button disabled={currentPage === 1} onClick={() => handleChangePage(currentPage - 1)} className={styles.navigationButton}>Previous</button>
          <span className={styles.currentPage}>{currentPage}</span>
          <button disabled={currentPage * rowsPerPage >= timestamps.length} onClick={() => handleChangePage(currentPage + 1)} className={styles.navigationButton}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default CryptoTable;
