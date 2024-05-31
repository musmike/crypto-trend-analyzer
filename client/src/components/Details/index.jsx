import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoChart from './CryptoChart';
import styles from "./styles.module.css";
import CryptoTable from './CryptoTable';
import EventInfluenceTable from './EventInfluenceTable';

const Details = () => {
    const [cryptocurrencyData, setCryptocurrencyData] = useState([]);
    const [eventsData, setEventsData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8089/app/data');
            const cryptocurrencies = response.data.cryptocurrencies;
            const events = response.data.events;

            setCryptocurrencyData(cryptocurrencies);
            setEventsData(events);
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className={styles.details_container}>

            <div className={styles.button_container}>
                <button onClick={fetchData} className={styles.refresh_button}>Odśwież dane</button>
            </div>

            <div className={styles.chart_container}>
                <h2>Kształtowanie się wartości kryptowalut w czasie</h2>
                <CryptoChart cryptocurrencyData={cryptocurrencyData} eventsData={eventsData} />
            </div>

            <div className={styles.table_container}>
                <CryptoTable cryptocurrencyData={cryptocurrencyData} />
            </div>

            <div className={styles.event_influence_table_container}>
                <EventInfluenceTable cryptocurrencyData={cryptocurrencyData} eventsData={eventsData} />
            </div>


        </div>
    );
};

export default Details;
