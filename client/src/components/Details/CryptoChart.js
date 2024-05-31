import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import moment from 'moment';

const CryptoChart = ({ cryptocurrencyData, eventsData }) => {
  const categoryColors = {
    "Gospodarka": "rgb(255, 99, 132)",
    "Popkultura": "rgb(54, 162, 235)",
    "Sport": "rgb(75, 192, 192)",
    "Polityka": "rgb(255, 205, 86)",
    "Technologia": "rgb(153, 102, 255)"
  };

  const [bitcoinData, setBitcoinData] = useState([]);
  const [ethereumData, setEthereumData] = useState([]);
  const [binanceCoinData, setBinanceCoinData] = useState([]);
  const [dogecoinData, setDogecoinData] = useState([]);
  const [litecoinData, setLitecoinData] = useState([]);
  const [eventsDataState, setEventsDataState] = useState([]);

  const chartRef = useRef(null);

  useEffect(() => {
    if (cryptocurrencyData.length > 0) {
      const bitcoinPrices = cryptocurrencyData.filter(currency => currency.symbol === 'BTC');
      const ethereumPrices = cryptocurrencyData.filter(currency => currency.symbol === 'ETH');
      const binanceCoinPrices = cryptocurrencyData.filter(currency => currency.symbol === 'BNB');
      const dogecoinPrices = cryptocurrencyData.filter(currency => currency.symbol === 'DOGE');
      const litecoinPrices = cryptocurrencyData.filter(currency => currency.symbol === 'LTC');

      const formattedBitcoinData = formatData(bitcoinPrices);
      const formattedEthereumData = formatData(ethereumPrices);
      const formattedBinanceCoinData = formatData(binanceCoinPrices);
      const formattedDogecoinData = formatData(dogecoinPrices);
      const formattedLitecoinData = formatData(litecoinPrices);

      setBitcoinData(formattedBitcoinData);
      setEthereumData(formattedEthereumData);
      setBinanceCoinData(formattedBinanceCoinData);
      setDogecoinData(formattedDogecoinData);
      setLitecoinData(formattedLitecoinData);
    }
  }, [cryptocurrencyData]);

  useEffect(() => {
    if (eventsData.length > 0) {
      const formattedEventsData = formatEvents(eventsData);
      setEventsDataState(formattedEventsData);
    }
  }, [eventsData]);

  useEffect(() => {
    if (chartRef.current) {
      updateChart();
    }
  }, [bitcoinData, ethereumData, binanceCoinData, dogecoinData, litecoinData, eventsDataState]);

  const formatData = (data) => {
    return data.map(({ timestamp, value }) => ({
      x: moment(timestamp).toDate(),
      y: value,
    }));
  };

  const formatEvents = (events) => {
    return events.map(({ timestamp, description, category }) => ({
      x: moment(timestamp).toDate(),
      y: 0,
      description: description,
      backgroundColor: categoryColors[category]
    }));
  };

  const updateChart = () => {
    if (!chartRef.current) return;
  
    const chart = chartRef.current;
  
    chart.data.datasets[0].data = bitcoinData;
    chart.data.datasets[1].data = ethereumData;
    chart.data.datasets[2].data = binanceCoinData;
    chart.data.datasets[3].data = dogecoinData;
    chart.data.datasets[4].data = litecoinData;
  
    // Aktualizacja danych dla wydarzeń
    const eventDataset = chart.data.datasets[5];
    eventDataset.data = eventsDataState;
    eventDataset.pointBackgroundColor = eventsDataState.map(event => event.backgroundColor);
  
    chart.update();
  };

  useEffect(() => {
    if (!chartRef.current) {
      chartRef.current = new Chart(document.getElementById('cryptoChart'), {
        type: 'line',
        data: {
          datasets: [
            // datasets for cryptocurrencies
            {
              label: 'Bitcoin',
              data: [],
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              fill: false,
            },
            {
              label: 'Ethereum',
              data: [],
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1,
              fill: false,
            },
            {
              label: 'Binance Coin',
              data: [],
              borderColor: 'rgb(54, 162, 235)',
              tension: 0.1,
              fill: false,
            },
            {
              label: 'Dogecoin',
              data: [],
              borderColor: 'rgb(255, 205, 86)',
              tension: 0.1,
              fill: false,
            },
            {
              label: 'Litecoin',
              data: [],
              borderColor: 'rgb(153, 102, 255)',
              tension: 0.1,
              fill: false,
            },
            {
              label: 'Wydarzenia',
              data: [],
              pointStyle: 'triangle',
              pointRadius: 10,
              tension: 0,
              fill: false,
              showLine: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
              title: {
                display: true,
                text: 'Cena (USD)'
              },
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  if (context.dataset.label === 'Events') {
                    return context.raw.description;
                  } else {
                    return `${context.dataset.label}: ${context.raw.y}`;
                  }
                }
              }
            }
          }
        }
      });
    }
  }, []);

  return (
    <div>
      <canvas id="cryptoChart" width="800" height="400"></canvas>
    </div>
  );
};

export default CryptoChart;
