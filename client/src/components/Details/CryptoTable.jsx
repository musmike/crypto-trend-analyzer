import React, { useState } from 'react';
import styles from './CryptoTable.module.css';

const CryptoTable = ({ cryptocurrencyData }) => {
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageNumberInput, setPageNumberInput] = useState('');

	const cryptocurrencies = Array.from(new Set(cryptocurrencyData.map(data => data.coin)));
	const timestamps = Array.from(new Set(cryptocurrencyData.map(data => data.date)));
	timestamps.sort((a, b) => new Date(a) - new Date(b));

	const getPrice = (symbol, timestamp) => {
		const data = cryptocurrencyData.find(item => item.coin === symbol && item.date === timestamp);
		return data ? `$${Number(data.value).toLocaleString('en-US')}` : null;
	};

	const totalPages = Math.ceil(timestamps.length / rowsPerPage);

	const handleChangePage = (pageNumber) => {
		if (pageNumber >= 1 && pageNumber <= totalPages) {
			setCurrentPage(pageNumber);
		}
	};

	const fullNames = {
		BNB: 'Binance Coin',
		BTC: 'Bitcoin',
		DOGE: 'Dogecoin',
		ETH: 'Ethereum',
		LTC: 'Litecoin'
	};

	return (
		<div className={styles.tableContainer}>
			<table className={styles.cryptoTable}>
				<thead>
					<tr>
						<th>Date</th>
						{cryptocurrencies.map(crypto => (
							<th key={crypto}>
								{crypto} ({fullNames[crypto]})
							</th>
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
					<button disabled={currentPage === 1} onClick={() => handleChangePage(currentPage - 1)} className={styles.navigationButton}>
						Previous
					</button>
					<button disabled={currentPage * rowsPerPage >= timestamps.length} onClick={() => handleChangePage(currentPage + 1)} className={styles.navigationButton}>
						Next
					</button>
					<input
						type="number"
						value={pageNumberInput}
						onChange={(e) => setPageNumberInput(e.target.value.replace(/[^0-9]/g, ''))}
						className={styles.pageNumberInput}
						placeholder={`Page ${currentPage} of ${totalPages}`}
					/>
					<button onClick={() => handleChangePage(parseInt(pageNumberInput))} className={styles.goToPageButton}>
						Go
					</button>
				</div>
			</div>
		</div>
	);
};

export default CryptoTable;