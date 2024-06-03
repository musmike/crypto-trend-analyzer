import React from 'react';
import styles from './EventInfluenceTables.module.css';

const EventInfluenceTables = ({ cryptocurrencyData, eventsData }) => {

    const getCryptoPriceOnDate = (cryptocurrencySymbol, date) => {
        const eventDate = new Date(date).getTime();
        const crypto = cryptocurrencyData.find(crypto => crypto.symbol === cryptocurrencySymbol 
            && new Date(crypto.timestamp).getTime() === eventDate);
        return crypto ? crypto.value : null;
    };

    const calculatePercentageChange = (initialValue, finalValue) => {
        return ((finalValue - initialValue) / initialValue) * 100;
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
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

        if (change > 0) {
            return <span className={styles.positive}>↗ {formattedChange}</span>;
        } 
        else if (change < 0) {
            return <span className={styles.negative}>↘ {formattedChange}</span>;
        } 
        else {
            return formattedChange;
        }
    };

    const generateTableDataForCategory = (category) => {
        const filteredEvents = eventsData.filter(event => event.category === category);
        filteredEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        const tableData = [];

        filteredEvents.forEach(event => {
            const eventDate = new Date(event.timestamp);
            const row = {
                eventDescription: (
                    <>
                        {event.description} <br /> ({formatDate(event.timestamp)})
                    </>
                ),
                BTC: {},
                ETH: {},
                BNB: {},
                DOGE: {},
                LTC: {}
            };

            Object.keys(row).forEach(key => {
                if (key !== 'eventDescription') {
                    const cryptoSymbol = key;
                    const priceOnEventDate = getCryptoPriceOnDate(cryptoSymbol, event.timestamp);
                    
                    row[key].changeYearBefore = '-';
                    row[key].changeMonthBefore = '-';
                    row[key].change7DaysBefore = '-';
                    row[key].change1DayBefore = '-';
                    row[key].priceOnEventDate = priceOnEventDate ? `$${priceOnEventDate}` : '-';
                    row[key].changeAfter1Day = '-';
                    row[key].changeAfter7Days = '-';
                    row[key].changeAfterMonth = '-';
                    row[key].changeAfterYear = '-';

                    if (priceOnEventDate !== null && priceOnEventDate !== 0) {
                        const priceYearBefore = getCryptoPriceOnDate(cryptoSymbol, addYears(eventDate, -1));
                        if (priceYearBefore !== null && priceYearBefore !== 0) {
                            const changeYearBefore = calculatePercentageChange(priceYearBefore, priceOnEventDate);
                            row[key].changeYearBefore = formatChange(changeYearBefore);
                        }
                    
                        const priceMonthBefore = getCryptoPriceOnDate(cryptoSymbol, addMonths(eventDate, -1));
                        if (priceMonthBefore !== null && priceMonthBefore !== 0) {
                            const changeMonthBefore = calculatePercentageChange(priceMonthBefore, priceOnEventDate);
                            row[key].changeMonthBefore = formatChange(changeMonthBefore);
                        }
                    
                        const price7DaysBefore = getCryptoPriceOnDate(cryptoSymbol, addDays(eventDate, -7));
                        if (price7DaysBefore !== null && price7DaysBefore !== 0) {
                            const change7DaysBefore = calculatePercentageChange(price7DaysBefore, priceOnEventDate);
                            row[key].change7DaysBefore = formatChange(change7DaysBefore);
                        }
                    
                        const price1DayBefore = getCryptoPriceOnDate(cryptoSymbol, addDays(eventDate, -1));
                        if (price1DayBefore !== null && price1DayBefore !== 0) {
                            const change1DayBefore = calculatePercentageChange(price1DayBefore, priceOnEventDate);
                            row[key].change1DayBefore = formatChange(change1DayBefore);
                        }
         
                        const priceAfter1Day = getCryptoPriceOnDate(cryptoSymbol, addDays(eventDate, 1));
                        if (priceAfter1Day !== null && priceAfter1Day !== 0) {
                            const change1DayAfter = calculatePercentageChange(priceOnEventDate, priceAfter1Day);
                            row[key].changeAfter1Day = formatChange(change1DayAfter);
                        }
                    
                        const priceAfter7Days = getCryptoPriceOnDate(cryptoSymbol, addDays(eventDate, 7));
                        if (priceAfter7Days !== null && priceAfter7Days !== 0) {
                            const change7DaysAfter = calculatePercentageChange(priceOnEventDate, priceAfter7Days);
                            row[key].changeAfter7Days = formatChange(change7DaysAfter);
                        }
                    
                        const priceAfterMonth = getCryptoPriceOnDate(cryptoSymbol, addMonths(eventDate, 1));
                        if (priceAfterMonth !== null && priceAfterMonth !== 0) {
                            const changeMonthAfter = calculatePercentageChange(priceOnEventDate, priceAfterMonth);
                            row[key].changeAfterMonth = formatChange(changeMonthAfter);
                        }
                    
                        const priceAfterYear = getCryptoPriceOnDate(cryptoSymbol, addYears(eventDate, 1));
                        if (priceAfterYear !== null && priceAfterYear !== 0) {
                            const changeYearAfter = calculatePercentageChange(priceOnEventDate, priceAfterYear);
                            row[key].changeAfterYear = formatChange(changeYearAfter);
                        }
                    }
                }
            });
            tableData.push(row);
        });

        return tableData;
    };

    const categories = [...new Set(eventsData.map(event => event.category))];

    const formatExportData = () => {
        const categories = [...new Set(eventsData.map(event => event.category))];
        const exportData = categories.map(category => {
            const events = eventsData.filter(event => event.category === category).map(event => {
                const eventDate = new Date(event.timestamp);
                const cryptocurrencies = ['BTC', 'ETH', 'BNB', 'DOGE', 'LTC'].map(cryptoSymbol => {
                    const priceOnEventDate = getCryptoPriceOnDate(cryptoSymbol, event.timestamp);
                    const priceYearBefore = getCryptoPriceOnDate(cryptoSymbol, addYears(eventDate, -1));
                    const priceMonthBefore = getCryptoPriceOnDate(cryptoSymbol, addMonths(eventDate, -1));
                    const price7DaysBefore = getCryptoPriceOnDate(cryptoSymbol, addDays(eventDate, -7));
                    const price1DayBefore = getCryptoPriceOnDate(cryptoSymbol, addDays(eventDate, -1));
                    const priceAfter1Day = getCryptoPriceOnDate(cryptoSymbol, addDays(eventDate, 1));
                    const priceAfter7Days = getCryptoPriceOnDate(cryptoSymbol, addDays(eventDate, 7));
                    const priceAfterMonth = getCryptoPriceOnDate(cryptoSymbol, addMonths(eventDate, 1));
                    const priceAfterYear = getCryptoPriceOnDate(cryptoSymbol, addYears(eventDate, 1));

                    return {
                        symbol: cryptoSymbol,

                        zmianaRokPrzed: priceOnEventDate !== null && priceYearBefore !== null && priceYearBefore !== 0
                            ? `${calculatePercentageChange(priceYearBefore, priceOnEventDate).toFixed(2)}%` : '-',
                        zmianaMiesiacPrzed: priceOnEventDate !== null && priceMonthBefore !== null && priceMonthBefore !== 0
                            ? `${calculatePercentageChange(priceMonthBefore, priceOnEventDate).toFixed(2)}%` : '-',
                        zmiana7DniPrzed: priceOnEventDate !== null && price7DaysBefore !== null && price7DaysBefore !== 0 
                            ? `${calculatePercentageChange(price7DaysBefore, priceOnEventDate).toFixed(2)}%` : '-',
                        zmiana1DzienPrzed: priceOnEventDate !== null && price1DayBefore !== null && price1DayBefore !== 0
                            ? `${calculatePercentageChange(price1DayBefore, priceOnEventDate).toFixed(2)}%` : '-',

                        wartoscWydarzenie: priceOnEventDate ? `$${priceOnEventDate}` : '-',

                        zmianaPo1Dniu: priceOnEventDate !== null && priceAfter1Day !== null && priceOnEventDate !== 0
                            ? `${calculatePercentageChange(priceOnEventDate, priceAfter1Day).toFixed(2)}%` : '-',
                        zmianaPo7Dniach: priceOnEventDate !== null && priceAfter7Days !== null && priceOnEventDate !== 0
                            ? `${calculatePercentageChange(priceOnEventDate, priceAfter7Days).toFixed(2)}%` : '-',
                        zmianaPoMiesiacu: priceOnEventDate !== null && priceAfterMonth !== null && priceOnEventDate !== 0
                            ? `${calculatePercentageChange(priceOnEventDate, priceAfterMonth).toFixed(2)}%` : '-',
                        zmianaPoRoku: priceOnEventDate !== null && priceAfterYear !== null && priceOnEventDate !== 0
                            ? `${calculatePercentageChange(priceOnEventDate, priceAfterYear).toFixed(2)}%` : '-'
                    };
                });

                return {
                    opisWydarzenia: event.description,
                    dataWydarzenia: formatDate(event.timestamp),
                    kryptowaluty: cryptocurrencies
                };
            });

            return {
                nazwaKategorii: category,
                wydarzenia: events
            };
        });

        return exportData;
    };

    const exportData = () => {
        const data = formatExportData();
        const json = JSON.stringify({ kategorieWydarzen: data }, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'event_influence_data.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className={styles.event_influence_tables}>
            {categories.map((category, index) => (
                <div key={index}>
                    <h2>Kategoria: {category}</h2>
                    <div className={styles.table_container}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Wydarzenie</th>
                                    <th>Kryptowaluta</th>
                                    <th>Rok przed %</th>
                                    <th>Miesiąc przed %</th>
                                    <th>Tydzień przed %</th>
                                    <th>Dzień przed %</th>
                                    <th>Wartość w dniu wydarzenia</th>
                                    <th>Dzień po %</th>
                                    <th>Tydzień po %</th>
                                    <th>Miesiąc po %</th>
                                    <th>Rok po %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {generateTableDataForCategory(category).map((row, rowIndex) => (
                                    <React.Fragment key={rowIndex}>
                                        <tr>
                                            <td rowSpan={6} className={styles.event_description}>{row.eventDescription}</td>
                                        </tr>
                                        {Object.keys(row).filter(key => key !== 'eventDescription').map((cryptoSymbol, cryptoIndex) => (
                                            <tr key={cryptoIndex}>
                                                <td>{cryptoSymbol}</td>
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
            <button className={styles.export_button} onClick={exportData}>Eksportuj dane</button>
        </div>
    );
    
};

export default EventInfluenceTables;
