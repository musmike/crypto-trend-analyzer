import React from 'react';
import styles from './EventInfluenceTables.module.css';

const EventInfluenceTables = ({ cryptocurrencyData, eventsData }) => {

    const getCryptoPriceOnDate = (cryptocurrencySymbol, date) => {
        const eventDate = new Date(date).setHours(0, 0, 0, 0); 
        const crypto = cryptocurrencyData.find(c => c.coin === cryptocurrencySymbol 
            && new Date(c.date).setHours(0, 0, 0, 0) === eventDate);
        return crypto ? crypto.value : null;
    };

    const calculatePercentageChange = (initialValue, finalValue) => {
        return ((finalValue - initialValue) / initialValue) * 100;
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const addDays = (date, days) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    };

    const addMonths = (date, months) => {
        const d = new Date(date);
        d.setMonth(d.getMonth() + months);
        return d;
    };

    const addYears = (date, years) => {
        const d = new Date(date);
        d.setFullYear(d.getFullYear() + years);
        return d;
    };

    const formatChange = (change) => {
        if (change === "-") return "-";
        const formattedChange = change.toFixed(2) + '%';
        if (change > 0) return <span className={styles.positive}>↗&nbsp;{formattedChange}</span>;
        if (change < 0) return <span className={styles.negative}>↘&nbsp;{formattedChange}</span>;
        return formattedChange;
    };

    const categories = [...new Set(eventsData.map(event => event.type))];

    const generateTableDataForCategory = (category) => {
        const filteredEvents = eventsData.filter(event => event.type === category);
        filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

        const tableData = [];

        filteredEvents.forEach(event => {
            const eventDate = new Date(event.date);
            const row = {
                eventDescription: (
                    <>
                        {event.name} <br /> <small>({formatDate(event.date)})</small>
                    </>
                ),
                BTC: {}, ETH: {}, BNB: {}, DOGE: {}, LTC: {}
            };

            ['BTC', 'ETH', 'BNB', 'DOGE', 'LTC'].forEach(cryptoSymbol => {
                const priceOnEventDate = getCryptoPriceOnDate(cryptoSymbol, event.date);
                
                row[cryptoSymbol].priceOnEventDate = priceOnEventDate ? `$${Number(priceOnEventDate).toLocaleString()}` : '-';
                row[cryptoSymbol].changeYearBefore = '-';
                row[cryptoSymbol].changeMonthBefore = '-';
                row[cryptoSymbol].change7DaysBefore = '-';
                row[cryptoSymbol].change1DayBefore = '-';
                row[cryptoSymbol].changeAfter1Day = '-';
                row[cryptoSymbol].changeAfter7Days = '-';
                row[cryptoSymbol].changeAfterMonth = '-';
                row[cryptoSymbol].changeAfterYear = '-';

                if (priceOnEventDate !== null && priceOnEventDate !== 0) {
                    const priceYearBefore = getCryptoPriceOnDate(cryptoSymbol, addYears(eventDate, -1));
                    if (priceYearBefore) row[cryptoSymbol].changeYearBefore = formatChange(calculatePercentageChange(priceYearBefore, priceOnEventDate));

                    const priceMonthBefore = getCryptoPriceOnDate(cryptoSymbol, addMonths(eventDate, -1));
                    if (priceMonthBefore) row[cryptoSymbol].changeMonthBefore = formatChange(calculatePercentageChange(priceMonthBefore, priceOnEventDate));

                    const price7DaysBefore = getCryptoPriceOnDate(cryptoSymbol, addDays(eventDate, -7));
                    if (price7DaysBefore) row[cryptoSymbol].change7DaysBefore = formatChange(calculatePercentageChange(price7DaysBefore, priceOnEventDate));

                    const price1DayBefore = getCryptoPriceOnDate(cryptoSymbol, addDays(eventDate, -1));
                    if (price1DayBefore) row[cryptoSymbol].change1DayBefore = formatChange(calculatePercentageChange(price1DayBefore, priceOnEventDate));

                    const priceAfter1Day = getCryptoPriceOnDate(cryptoSymbol, addDays(eventDate, 1));
                    if (priceAfter1Day) row[cryptoSymbol].changeAfter1Day = formatChange(calculatePercentageChange(priceOnEventDate, priceAfter1Day));

                    const priceAfter7Days = getCryptoPriceOnDate(cryptoSymbol, addDays(eventDate, 7));
                    if (priceAfter7Days) row[cryptoSymbol].changeAfter7Days = formatChange(calculatePercentageChange(priceOnEventDate, priceAfter7Days));

                    const priceAfterMonth = getCryptoPriceOnDate(cryptoSymbol, addMonths(eventDate, 1));
                    if (priceAfterMonth) row[cryptoSymbol].changeAfterMonth = formatChange(calculatePercentageChange(priceOnEventDate, priceAfterMonth));

                    const priceAfterYear = getCryptoPriceOnDate(cryptoSymbol, addYears(eventDate, 1));
                    if (priceAfterYear) row[cryptoSymbol].changeAfterYear = formatChange(calculatePercentageChange(priceOnEventDate, priceAfterYear));
                }
            });
            tableData.push(row);
        });

        return tableData;
    };

    const handleExportData = () => {
        const exportData = categories.map(category => ({
            categoryName: category,
            events: eventsData.filter(event => event.type === category).map(event => ({
                eventName: event.name,
                eventDate: formatDate(event.date),
                impacts: ['BTC', 'ETH', 'BNB', 'DOGE', 'LTC'].map(symbol => ({
                    asset: symbol,
                    priceOnEvent: getCryptoPriceOnDate(symbol, event.date)
                }))
            }))
        }));

        const json = JSON.stringify({ categories: exportData }, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'crypto_event_study_data.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className={styles.event_influence_tables}>
            {categories.map((category, index) => (
                <div key={index}>
                    <h2>Category: {category}</h2>
                    <div className={styles.table_container}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Event</th>
                                    <th>Asset</th>
                                    <th>-1 Year %</th>
                                    <th>-1 Month %</th>
                                    <th>-7 Days %</th>
                                    <th>-1 Day %</th>
                                    <th>Price on Event</th>
                                    <th>+1 Day %</th>
                                    <th>+7 Days %</th>
                                    <th>+1 Month %</th>
                                    <th>+1 Year %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {generateTableDataForCategory(category).map((row, rowIndex) => (
                                    <React.Fragment key={rowIndex}>
                                        <tr>
                                            <td rowSpan={6} className={styles.event_description}>{row.eventDescription}</td>
                                        </tr>
                                        {['BTC', 'ETH', 'BNB', 'DOGE', 'LTC'].map((cryptoSymbol, cryptoIndex) => (
                                            <tr key={cryptoIndex}>
                                                <td><strong>{cryptoSymbol}</strong></td>
                                                <td>{row[cryptoSymbol].changeYearBefore}</td>
                                                <td>{row[cryptoSymbol].changeMonthBefore}</td>
                                                <td>{row[cryptoSymbol].change7DaysBefore}</td>
                                                <td>{row[cryptoSymbol].change1DayBefore}</td>
                                                <td>{row[cryptoSymbol].priceOnEventDate}</td>
                                                <td>{row[cryptoSymbol].changeAfter1Day}</td>
                                                <td>{row[cryptoSymbol].changeAfter7Days}</td>
                                                <td>{row[cryptoSymbol].changeAfterMonth}</td>
                                                <td>{row[cryptoSymbol].changeAfterYear}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
            <button className={styles.export_button} onClick={handleExportData}>Export JSON Data</button>
        </div>
    );
};

export default EventInfluenceTables;