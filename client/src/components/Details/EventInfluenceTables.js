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

    const generateTableDataForCategory = (category) => {
        const filteredEvents = eventsData.filter(event => event.category === category);
        filteredEvents.sort((a, b) => {
            return new Date(a.timestamp) - new Date(b.timestamp);
        });
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
                    
                    row[key].priceOnEventDate = priceOnEventDate ? `$${priceOnEventDate}` : '-';
                    row[key].change1Day = '-';
                    row[key].change7Days = '-';
                    row[key].changeMonth = '-';
                    row[key].changeYear = '-';

                    if (priceOnEventDate !== null) {
                        const priceAfter1Day = getCryptoPriceOnDate(cryptoSymbol, 
                            new Date(eventDate.getTime() + 1 * 24 * 60 * 60 * 1000));
                        if (priceAfter1Day !== null) {
                            const change1Day = calculatePercentageChange(priceOnEventDate, priceAfter1Day);
                            row[key].change1Day = formatChange(change1Day);
                        }
    
                        const priceAfter7Days = getCryptoPriceOnDate(cryptoSymbol, 
                            new Date(eventDate.getTime() + 7 * 24 * 60 * 60 * 1000));
                        if (priceAfter7Days !== null) {
                            const change7Days = calculatePercentageChange(priceOnEventDate, priceAfter7Days);
                            row[key].change7Days = formatChange(change7Days);
                        }
    
                        const priceAfterMonth = getCryptoPriceOnDate(cryptoSymbol, addMonths(eventDate, 1));
                        if (priceAfterMonth !== null) {
                            const changeMonth = calculatePercentageChange(priceOnEventDate, priceAfterMonth);
                            row[key].changeMonth = formatChange(changeMonth);
                        }
    
                        const priceAfterYear = getCryptoPriceOnDate(cryptoSymbol, addYears(eventDate, 1));
                        if (priceAfterYear !== null) {
                            const changeYear = calculatePercentageChange(priceOnEventDate, priceAfterYear);
                            row[key].changeYear = formatChange(changeYear);
                        }
                    }
                }
            });
            tableData.push(row);
        });
        return tableData;
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

    const categories = [...new Set(eventsData.map(event => event.category))];

    const formatExportData = () => {
        const categories = [...new Set(eventsData.map(event => event.category))];
        const exportData = categories.map(category => {
            const events = eventsData.filter(event => event.category === category).map(event => {
                const eventDate = new Date(event.timestamp);
                const cryptocurrencies = ['BTC', 'ETH', 'BNB', 'DOGE', 'LTC'].map(cryptoSymbol => {
                    const priceOnEventDate = getCryptoPriceOnDate(cryptoSymbol, event.timestamp);
                    const priceAfter1Day = getCryptoPriceOnDate(cryptoSymbol, 
                        new Date(eventDate.getTime() + 1 * 24 * 60 * 60 * 1000));
                    const priceAfter7Days = getCryptoPriceOnDate(cryptoSymbol, 
                        new Date(eventDate.getTime() + 7 * 24 * 60 * 60 * 1000));
                    const priceAfterMonth = getCryptoPriceOnDate(cryptoSymbol, addMonths(eventDate, 1));
                    const priceAfterYear = getCryptoPriceOnDate(cryptoSymbol, addYears(eventDate, 1));

                    return {
                        symbol: cryptoSymbol,
                        wartoscWydarzenie: priceOnEventDate ? `$${priceOnEventDate}` : '-',
                        zmiana1Dzien: priceOnEventDate !== null && priceAfter1Day !== null 
                            ? `${calculatePercentageChange(priceOnEventDate, priceAfter1Day).toFixed(2)}%` : '-',
                        zmiana7Dni: priceOnEventDate !== null && priceAfter7Days !== null 
                            ? `${calculatePercentageChange(priceOnEventDate, priceAfter7Days).toFixed(2)}%` : '-',
                        zmianaMiesiac: priceOnEventDate !== null && priceAfterMonth !== null 
                            ? `${calculatePercentageChange(priceOnEventDate, priceAfterMonth).toFixed(2)}%` : '-',
                        zmianaRok: priceOnEventDate !== null && priceAfterYear !== null 
                            ? `${calculatePercentageChange(priceOnEventDate, priceAfterYear).toFixed(2)}%` : '-'
                    };
                });

                return {
                    opisWydarzenia: event.description,
                    dataWydarzenia: event.timestamp,
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

                    <table>

                        <thead>
                            <tr>
                                <th>Wydarzenie</th>
                                <th>Kryptowaluta</th>
                                <th>Wartość w dniu wydarzenia</th>
                                <th>1 dzień %</th>
                                <th>Tydzień %</th>
                                <th>Miesiąc %</th>
                                <th>Rok %</th>
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
                                            <td>{row[cryptoSymbol].priceOnEventDate}</td>
                                            <td>{row[cryptoSymbol].change1Day}</td>
                                            <td>{row[cryptoSymbol].change7Days}</td>
                                            <td>{row[cryptoSymbol].changeMonth}</td>
                                            <td>{row[cryptoSymbol].changeYear}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>

                    </table>

                </div>
            ))}

            <button className={styles.export_button} onClick={exportData}>Eksportuj dane</button>

        </div>
    );
};

export default EventInfluenceTables;
