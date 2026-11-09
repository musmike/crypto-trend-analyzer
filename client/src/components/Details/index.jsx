import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoChart from './CryptoChart';
import styles from "./styles.module.css";
import CryptoTable from './CryptoTable';
import EventInfluenceTables from './EventInfluenceTables';

const Details = () => {
    const [cryptocurrencyData, setCryptocurrencyData] = useState([]);
    const [eventsData, setEventsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const config = {
                    method: 'get',
                    url: 'http://localhost:8089/view/all',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${token}` 
                    }
                };

                const { data: res } = await axios(config);
                setCryptocurrencyData(res.cryptocurrencies || []);
                setEventsData(res.events || []);
                setIsLoading(false);
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                    localStorage.removeItem("token");
                    window.location.reload();
                }
                setIsLoading(false); 
            }
        } else {
            window.location.reload();
            setIsLoading(false); 
        }
    };

    return (
        <div className={styles.details_container}>
            <div className={styles.content_container}>
                <div className={styles.button_container}>
                    <button onClick={fetchData} className={styles.refresh_button}>Refresh Data 🗘</button>
                </div>

                {isLoading ? (
                    <div className={styles.loader_container}>
                        <div className={styles.loader}></div>
                    </div>
                ) : (
                    <>
                        <div className={styles.chart_container}>
                            <h2>Cryptocurrency Price Evolution and Historical Events</h2>
                            {cryptocurrencyData.length > 0 && eventsData.length > 0 ? (
                                <CryptoChart cryptocurrencyData={cryptocurrencyData} eventsData={eventsData} />
                            ) : (
                                <p>No data available to display.</p>
                            )}
                        </div>
    
                        <div className={styles.table_container}>
                            {cryptocurrencyData.length > 0 ? (
                                <CryptoTable cryptocurrencyData={cryptocurrencyData} />
                            ) : (
                                <p>No data available to display.</p>
                            )}
                        </div>
    
                        <div className={styles.event_influence_tables_container}>
                            {cryptocurrencyData.length > 0 && eventsData.length > 0 ? (
                                <EventInfluenceTables cryptocurrencyData={cryptocurrencyData} eventsData={eventsData} />
                            ) : (
                                <p>No data available to display.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Details;