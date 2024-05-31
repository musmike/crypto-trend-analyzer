import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import moment from 'moment';

const CryptoChart = () => {

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
  const [eventsData, setEventsData] = useState([]);

  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8089/app/data');
        const cryptocurrencies = response.data.cryptocurrencies;
        const events = response.data.events;

        const bitcoinPrices = cryptocurrencies.filter(currency => currency.symbol === 'BTC');
        const ethereumPrices = cryptocurrencies.filter(currency => currency.symbol === 'ETH');
        const binanceCoinPrices = cryptocurrencies.filter(currency => currency.symbol === 'BNB');
        const dogecoinPrices = cryptocurrencies.filter(currency => currency.symbol === 'DOGE');
        const litecoinPrices = cryptocurrencies.filter(currency => currency.symbol === 'LTC');

        const formattedBitcoinData = formatData(bitcoinPrices);
        const formattedEthereumData = formatData(ethereumPrices);
        const formattedBinanceCoinData = formatData(binanceCoinPrices);
        const formattedDogecoinData = formatData(dogecoinPrices);
        const formattedLitecoinData = formatData(litecoinPrices);
        const formattedEventsData = formatEvents(events);

        setBitcoinData(formattedBitcoinData);
        setEthereumData(formattedEthereumData);
        setBinanceCoinData(formattedBinanceCoinData);
        setDogecoinData(formattedDogecoinData);
        setLitecoinData(formattedLitecoinData);
        setEventsData(formattedEventsData);
      }
      catch (error) {
        console.error('Error fetching cryptocurrency data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      updateChart();
    }
  }, [bitcoinData, ethereumData, binanceCoinData, dogecoinData, litecoinData, eventsData]);

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
    eventDataset.data = eventsData;
    eventDataset.pointBackgroundColor = eventsData.map(event => event.backgroundColor);
  
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
              label: 'Events',
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
