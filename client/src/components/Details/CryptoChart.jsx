import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import moment from 'moment';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './CryptoChart.module.css';

const CryptoChart = ({ cryptocurrencyData, eventsData }) => {
    const [dateRange, setDateRange] = useState([0, 100]);
    const [mainCrypto, setMainCrypto] = useState('BTC');
    const [comparisonCrypto, setComparisonCrypto] = useState('ETH');
    const [logarithmicScale, setLogarithmicScale] = useState(false);
    const chartRef = useRef(null);

    const minDate = useMemo(() => {
        const allTimestamps = [
            ...cryptocurrencyData.map(item => moment(item.date).valueOf()),
            ...eventsData.map(event => moment(event.date).valueOf())
        ];
        return Math.min(...allTimestamps);
    }, [cryptocurrencyData, eventsData]);

    const maxDate = useMemo(() => {
        const allTimestamps = [
            ...cryptocurrencyData.map(item => moment(item.date).valueOf()),
            ...eventsData.map(event => moment(event.date).valueOf())
        ];
        return Math.max(...allTimestamps);
    }, [cryptocurrencyData, eventsData]);

    const filteredCryptoData = useMemo(() => {
        const startDate = moment(minDate).add((maxDate - minDate) * (dateRange[0] / 100), 'milliseconds');
        const endDate = moment(minDate).add((maxDate - minDate) * (dateRange[1] / 100), 'milliseconds');
        return cryptocurrencyData
            .filter(item => {
                const itemDate = moment(item.date);
                return itemDate.isSameOrAfter(startDate) && itemDate.isSameOrBefore(endDate);
            })
            .sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
    }, [dateRange, minDate, maxDate, cryptocurrencyData]);

    const filteredEventsData = useMemo(() => {
        const startDate = moment(minDate).add((maxDate - minDate) * (dateRange[0] / 100), 'milliseconds');
        const endDate = moment(minDate).add((maxDate - minDate) * (dateRange[1] / 100), 'milliseconds');
        return eventsData.filter(event => {
            const eventDate = moment(event.date);
            return eventDate.isSameOrAfter(startDate) && eventDate.isSameOrBefore(endDate);
        });
    }, [dateRange, minDate, maxDate, eventsData]);

    useEffect(() => {
        const categoryColors = {
            "Economy": "rgb(255, 0, 0)",      // Red
            "Pop Culture": "rgb(0, 128, 0)",  // Green
            "Sports": "rgb(0, 0, 255)",       // Blue
            "Politics": "rgb(255, 165, 0)",   // Orange
            "Technology": "rgb(128, 0, 128)"  // Purple
        };

        const cryptoColors = {
            "BTC": "rgb(255, 51, 153)",  // Pink
            "ETH": "rgb(0, 153, 204)",   // Light Blue
            "BNB": "rgb(204, 0, 204)",   // Purple
            "DOGE": "rgb(255, 102, 0)",  // Orange
            "LTC": "rgb(102, 51, 0)"     // Brown
        };

        const activePrices = filteredCryptoData
            .filter(item => item.coin === mainCrypto || item.coin === comparisonCrypto)
            .map(item => item.value);

        const minValue = activePrices.length > 0 ? Math.min(...activePrices) : 1;

        if (chartRef.current) {
            const chartInstance = new Chart(chartRef.current, {
                type: 'line',
                data: {
                    datasets: [
                        ...Object.entries(categoryColors).map(([category, color]) => ({
                            label: category,
                            data: filteredEventsData
                                .filter(event => event.type === category)
                                .map(event => ({
                                    x: moment(event.date).valueOf(),
                                    y: logarithmicScale ? 0.3 * minValue : 0.01
                                })),
                            borderColor: 'transparent',
                            pointStyle: logarithmicScale ? 'line' : 'triangle',
                            pointRadius: 10,
                            pointBorderWidth: logarithmicScale ? 5 : 2,
                            pointRotation: logarithmicScale ? 90 : 0,
                            pointBorderColor: color,
                            pointBackgroundColor: color,
                            fill: false,
                        })),
                        {
                            label: mainCrypto,
                            data: filteredCryptoData.filter(item => item.coin === mainCrypto).map(item => ({ x: item.date, y: item.value })),
                            borderColor: cryptoColors[mainCrypto],
                            fill: false,
                            pointRadius: 1
                        },
                        {
                            label: comparisonCrypto,
                            data: filteredCryptoData.filter(item => item.coin === comparisonCrypto).map(item => ({ x: item.date, y: item.value })),
                            borderColor: cryptoColors[comparisonCrypto],
                            fill: false,
                            pointRadius: 1
                        }
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
                                    month: 'MM/YYYY'
                                }
                            },
                        },
                        y: {
                            type: logarithmicScale ? 'logarithmic' : 'linear',
                            title: {
                                display: true,
                                text: 'Price (USD)'
                            },
                            ticks: {
                                callback: function (value) {
                                    return '$' + Number(value).toLocaleString();
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
                                        const event = filteredEventsData.find(
                                            e => e.type === context.dataset.label && 
                                                 moment(e.date).valueOf() === context.parsed.x
                                        );
                                        if (event) {
                                            return event.name;
                                        }
                                    }
                                    return `${context.dataset.label}: $${Number(context.raw.y).toLocaleString()}`;
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

    return (
        <div className={styles.cryptoChartContainer}>
            <div className={styles.selectContainer}>
                <label className={styles.label}>Primary Asset: </label>
                <select className={styles.select} value={mainCrypto} onChange={(e) => setMainCrypto(e.target.value)}>
                    {['BTC', 'ETH', 'BNB', 'DOGE', 'LTC'].map((crypto) => (
                        <option key={crypto} value={crypto}>{crypto}</option>
                    ))}
                </select>
            </div>
            <div className={styles.selectContainer}>
                <label className={styles.label}>Comparison Asset: </label>
                <select className={styles.select} value={comparisonCrypto} onChange={(e) => setComparisonCrypto(e.target.value)}>
                    {['BTC', 'ETH', 'BNB', 'DOGE', 'LTC'].map((crypto) => (
                        <option key={crypto} value={crypto}>{crypto}</option>
                    ))}
                </select>
            </div>

            <div>
                <button className={styles.selectContainer} onClick={() => setLogarithmicScale(!logarithmicScale)}>
                    {logarithmicScale ? 'Switch to Linear Scale' : 'Switch to Logarithmic Scale'}
                </button>
            </div>

            <canvas ref={chartRef} className={styles.chartCanvas} />

            <div className={styles.sliderContainer}>
                <Slider
                    range
                    min={0}
                    max={100}
                    defaultValue={[0, 100]}
                    onChange={(range) => setDateRange(range)}
                    className={styles.slider}
                />
            </div>
        </div>
    );
};

export default CryptoChart;