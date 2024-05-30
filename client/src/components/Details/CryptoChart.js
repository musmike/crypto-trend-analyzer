import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import moment from 'moment'; // Dodaj import biblioteki moment.js

const CryptoChart = () => {
  const [bitcoinData, setBitcoinData] = useState([]);
  const [ethereumData, setEthereumData] = useState([]);
  const [binanceCoinData, setBinanceCoinData] = useState([]);
  const [dogecoinData, setDogecoinData] = useState([]);
  const [litecoinData, setLitecoinData] = useState([]);

  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8089/app/data');
        const cryptocurrencies = response.data.cryptocurrencies;

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

        setBitcoinData(formattedBitcoinData);
        setEthereumData(formattedEthereumData);
        setBinanceCoinData(formattedBinanceCoinData);
        setDogecoinData(formattedDogecoinData);
        setLitecoinData(formattedLitecoinData);
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
  }, [bitcoinData, ethereumData, binanceCoinData, dogecoinData, litecoinData]);

  const formatData = (data) => {
    return data.map(({ timestamp, value }) => ({
      x: moment(timestamp).toDate(),
      y: value,
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

    chart.update();
  };

  useEffect(() => {
    if (!chartRef.current) {
      chartRef.current = new Chart(document.getElementById('cryptoChart'), {
        type: 'line',
        data: {
          datasets: [
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
