import React from 'react';
import styles from './EventInfluenceTable.module.css';

const EventInfluenceTable = ({ cryptocurrencyData, eventsData }) => {

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

    const generateTableDataForCategory = (category) => {
        const filteredEvents = eventsData.filter(event => event.category === category);
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
                    row[key].change30Days = '-';
                    row[key].change365Days = '-';

                    if (priceOnEventDate !== null) {
                        const priceAfter1Day = getCryptoPriceOnDate(cryptoSymbol, new Date(eventDate.getTime() + 1 * 24 * 60 * 60 * 1000));
                        if (priceAfter1Day !== null) {
                            const change1Day = calculatePercentageChange(priceOnEventDate, priceAfter1Day);
                            row[key].change1Day = formatChange(change1Day);
                        }
    
                        const priceAfter7Days = getCryptoPriceOnDate(cryptoSymbol, new Date(eventDate.getTime() + 7 * 24 * 60 * 60 * 1000));
                        if (priceAfter7Days !== null) {
                            const change7Days = calculatePercentageChange(priceOnEventDate, priceAfter7Days);
                            row[key].change7Days = formatChange(change7Days);
                        }
    
                        const priceAfter30Days = getCryptoPriceOnDate(cryptoSymbol, new Date(eventDate.getTime() + 30 * 24 * 60 * 60 * 1000));
                        if (priceAfter30Days !== null) {
                            const change30Days = calculatePercentageChange(priceOnEventDate, priceAfter30Days);
                            row[key].change30Days = formatChange(change30Days);
                        }
    
                        const priceAfter365Days = getCryptoPriceOnDate(cryptoSymbol, new Date(eventDate.getTime() + 365 * 24 * 60 * 60 * 1000));
                        if (priceAfter365Days !== null) {
                            const change365Days = calculatePercentageChange(priceOnEventDate, priceAfter365Days);
                            row[key].change365Days = formatChange(change365Days);
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

    return (
        <div className={styles.event_influence_table}>
            {categories.map((category, index) => (
                <div key={index}>
                    <h2>Kategoria: {category}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Wydarzenie</th>
                                <th>Kryptowaluta</th>
                                <th>Wartość w dniu wydarzenia</th>
                                <th>1 dzień</th>
                                <th>7 dni</th>
                                <th>Miesiąc</th>
                                <th>Rok</th>
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
                                            <td>{row[cryptoSymbol].change30Days}</td>
                                            <td>{row[cryptoSymbol].change365Days}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default EventInfluenceTable;
