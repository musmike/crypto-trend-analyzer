import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import moment from 'moment';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './CryptoChart.module.css';

const CryptoChart = ({ cryptocurrencyData, eventsData }) => {

    const [filteredCryptoData, setFilteredCryptoData] = useState(cryptocurrencyData);
    const [filteredEventsData, setFilteredEventsData] = useState(eventsData);
    const [minDate, setMinDate] = useState(null);
    const [maxDate, setMaxDate] = useState(null);
    const [dateRange, setDateRange] = useState([0, 100]);
    const [mainCrypto, setMainCrypto] = useState('BTC');
    const [comparisonCrypto, setComparisonCrypto] = useState('ETH');
    const [logarithmicScale, setLogarithmicScale] = useState(false);
    const chartRef = useRef(null);

    useEffect(() => {
        const cryptoTimestamps = cryptocurrencyData.map(item => moment(item.timestamp).valueOf());
        const eventTimestamps = eventsData.map(event => moment(event.timestamp).valueOf());
        const allTimestamps = [...cryptoTimestamps, ...eventTimestamps];

        setMinDate(Math.min(...allTimestamps));
        setMaxDate(Math.max(...allTimestamps));

    }, [cryptocurrencyData, eventsData]);

    useEffect(() => {
        if (minDate && maxDate) {
            const startDate = moment(minDate).add((maxDate - minDate) * (dateRange[0] / 100), 'milliseconds');
            const endDate = moment(minDate).add((maxDate - minDate) * (dateRange[1] / 100), 'milliseconds');

            const filteredCrypto = cryptocurrencyData.filter(item => {
                const itemDate = moment(item.timestamp);
                return itemDate.isSameOrAfter(startDate) && itemDate.isSameOrBefore(endDate);
            });


            filteredCrypto.sort((a, b) => {
                return moment(a.timestamp).valueOf() - moment(b.timestamp).valueOf();
            });

            const filteredEvents = eventsData.filter(event => {
                const eventDate = moment(event.timestamp);
                return eventDate.isSameOrAfter(startDate) && eventDate.isSameOrBefore(endDate);
            });

            setFilteredCryptoData(filteredCrypto);
            setFilteredEventsData(filteredEvents);
        }
    }, [dateRange, minDate, maxDate, cryptocurrencyData, eventsData]);



    useEffect(() => {

        const categoryColors = {
            "Gospodarka": "rgb(255, 0, 0)", // Czerwony
            "Popkultura": "rgb(0, 128, 0)", // Zielony
            "Sport": "rgb(0, 0, 255)", // Niebieski
            "Polityka": "rgb(255, 165, 0)", // Pomarańczowy
            "Technologia": "rgb(128, 0, 128)" // Fioletowy
        };

        const cryptoColors = {
            "BTC": "rgb(255, 51, 153)", // Różowy
            "ETH": "rgb(0, 153, 204)", // Jasnoniebieski
            "BNB": "rgb(204, 0, 204)", // Purpurowy
            "DOGE": "rgb(255, 102, 0)", // Pomarańczowy
            "LTC": "rgb(102, 51, 0)" // Brązowy
        };

        const minValue = Math.min(...filteredCryptoData.filter(item => item.symbol === mainCrypto || item.symbol === comparisonCrypto).map(item => item.value));

        if (chartRef.current) {
            const chartInstance = new Chart(chartRef.current, {
                type: 'line',
                data: {
                    datasets: [
                        {
                            label: mainCrypto,
                            data: filteredCryptoData.filter(item => item.symbol === mainCrypto).map(item => ({ x: item.timestamp, y: item.value })),
                            borderColor: cryptoColors[mainCrypto],
                            fill: false,
                        },
                        {
                            label: comparisonCrypto,
                            data: filteredCryptoData.filter(item => item.symbol === comparisonCrypto).map(item => ({ x: item.timestamp, y: item.value })),
                            borderColor: cryptoColors[comparisonCrypto],
                            fill: false,
                        },
                        ...Object.entries(categoryColors).map(([category, color]) => ({
                            label: category,
                            data: logarithmicScale ? filteredEventsData
                              .filter(event => event.category === category)
                              .map(event => ({ x: event.timestamp.valueOf(), y: 0.3 * minValue})) :
                              filteredEventsData
                              .filter(event => event.category === category)
                              .map(event => ({ x: event.timestamp.valueOf(), y: 0.01 })),
                            borderColor: 'transparent',
                            pointStyle: logarithmicScale ? 'line' : 'triangle',
                            pointRadius: 10,
                            pointBorderWidth: logarithmicScale ? 5 : 2,
                            pointRotation: logarithmicScale ? 90 : 0,
                            pointBorderColor: color,
                            pointBackgroundColor: color,
                            fill: false,
                          }))
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'month',
                                displayFormats: {
                                    month: 'DD.MM.YYYY'
                                }
                            },
                        },
                        y: {
                            type: logarithmicScale ? 'logarithmic' : 'linear',
                            exponent: logarithmicScale ? 1 : 0,
                            title: {
                                display: true,
                                text: 'Cena (USD)'
                            },
                            ticks: {
                                beginAtZero: true,
                                callback: function (value) {
                                    return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                generateLabels: function (chart) {
                                    const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                                    labels.forEach(label => {
                                        if (label.text && categoryColors[label.text]) {
                                            label.fillStyle = categoryColors[label.text];
                                        }
                                    });
                                    return labels;
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    if (context.dataset.label in categoryColors) {

                                        const event = filteredEventsData.find(event => event.category === context.dataset.label && moment(event.timestamp).valueOf() === context.parsed.x);
                                        if (event) {
                                            return event.description;
                                        }
                                    }
                                    return `${context.dataset.label}: ${context.raw.y}`;
                                }
                            }
                        }
                    }
                }
            });

            return () => {
                chartInstance.destroy();
            };
        }
    }, [filteredCryptoData, filteredEventsData, mainCrypto, comparisonCrypto, logarithmicScale]);

    const handleDateChange = (range) => {
        setDateRange(range);
    };

    const handleMainCryptoChange = (e) => {
        setMainCrypto(e.target.value);
    };

    const handleComparisonCryptoChange = (e) => {
        setComparisonCrypto(e.target.value);
    };

    const handleScaleChange = () => {
        setLogarithmicScale(!logarithmicScale);
    };

    return (
        <div className={styles.cryptoChartContainer}>
            <div className={styles.selectContainer}>
                <label>Pierwsza kryptowaluta: </label>
                <select className={styles.select} value={mainCrypto} onChange={handleMainCryptoChange}>
                    {['BTC', 'ETH', 'BNB', 'DOGE', 'LTC'].map((crypto) => (
                        <option key={crypto} value={crypto}>{crypto}</option>
                    ))}
                </select>
            </div>
            <div className={styles.selectContainer}>
                <label>Druga kryptowaluta: </label>
                <select className={styles.select} value={comparisonCrypto} onChange={handleComparisonCryptoChange}>
                    {['BTC', 'ETH', 'BNB', 'DOGE', 'LTC'].map((crypto) => (
                        <option key={crypto} value={crypto}>{crypto}</option>
                    ))}
                </select>
            </div>

            <div>
                <button className={styles.selectContainer} onClick={handleScaleChange}>
                    {logarithmicScale ? 'Skala linowa' : 'Skala logarytmiczna'}
                </button>
            </div>

            <canvas ref={chartRef} className={styles.chartCanvas} />

            <div>
                <Slider
                    range
                    min={0}
                    max={100}
                    defaultValue={[0, 100]}
                    onChange={handleDateChange}
                    className={styles.slider}
                />
            </div>
        </div>
    );
};

export default CryptoChart;
