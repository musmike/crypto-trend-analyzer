import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "./styles.module.css";

import bitcoinIcon from './icons/bitcoin.svg';
import ethereumIcon from './icons/ethereum.svg';
import binanceCoinIcon from './icons/binance-coin.svg';
import dogecoinIcon from './icons/dogecoin.svg';
import litecoinIcon from './icons/litecoin.svg';

const Home = () => {
    const [cryptoPrices, setCryptoPrices] = useState({
        bitcoin: null,
        ethereum: null,
        binanceCoin: null,
        dogecoin: null,
        litecoin: null
    });

    useEffect(() => {
        const fetchCryptoPrices = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,dogecoin,litecoin&vs_currencies=usd');
                setCryptoPrices({
                    bitcoin: response.data.bitcoin.usd,
                    ethereum: response.data.ethereum.usd,
                    binanceCoin: response.data.binancecoin.usd,
                    dogecoin: response.data.dogecoin.usd,
                    litecoin: response.data.litecoin.usd
                });
            } catch (error) {
                console.error('Error fetching crypto prices:', error);
            }
        };

        fetchCryptoPrices();
    }, []);

    return (
        <div className={styles.home_container}>

            <div className={styles.left_container}>
                <h1>Kryptowaluty</h1>

                <p>Kryptowaluty to cyfrowe lub wirtualne waluty zabezpieczone kryptografią. Oto kilka z najbardziej znanych kryptowalut:</p>
                <ul>
                    <li><strong>Bitcoin (BTC)</strong> - Pierwsza i najbardziej znana kryptowaluta, stworzona w
                        2009 roku przez osobę lub grupę osób pod pseudonimem Satoshi Nakamoto. Często nazywana "cyfrowym złotem".</li>
                    <li><strong>Ethereum (ETH)</strong> - Platforma zdecentralizowanych aplikacji, znana ze
                        swojej funkcji inteligentnych kontraktów. Stworzona przez Vitalika Buterina w 2015 roku.</li>
                    <li><strong>Binance Coin (BNB)</strong> - Kryptowaluta wydana przez giełdę Binance. Używana
                        jest do opłacania transakcji na platformie Binance oraz do udziału w specjalnych ofertach tokenów.</li>
                    <li><strong>Dogecoin (DOGE)</strong> - Kryptowaluta stworzona jako żart w 2013 roku, oparta
                        na popularnym memie z psem rasy Shiba Inu. Pomimo swojego początkowego charakteru, zdobyła dużą popularność.</li>
                    <li><strong>Litecoin (LTC)</strong> - Stworzony w 2011 roku przez Charliego Lee, były pracownik Google.
                        Litecoin oferuje szybsze transakcje w porównaniu do Bitcoina i jest często nazywany "srebrem do złota Bitcoina".</li>
                </ul>

            </div>

            <div className={styles.right_container}>

                <h2>Aktualne kursy kryptowalut:</h2>

                <table className={styles.crypto_table}>
                    <tbody>
                        <tr>
                            <td><img src={bitcoinIcon} alt="Bitcoin icon" style={{ width: '32px', height: '32px' }} /> Bitcoin (BTC)</td>
                            <td>{cryptoPrices.bitcoin ? `$${cryptoPrices.bitcoin}` : 'Ładowanie...'}</td>
                        </tr>
                        <tr>
                            <td><img src={ethereumIcon} alt="Ethereum icon" style={{ width: '32px', height: '32px' }} /> Ethereum (ETH)</td>
                            <td>{cryptoPrices.ethereum ? `$${cryptoPrices.ethereum}` : 'Ładowanie...'}</td>
                        </tr>
                        <tr>
                            <td><img src={binanceCoinIcon} alt="Binance Coin icon" style={{ width: '32px', height: '32px' }} /> Binance Coin (BNB)</td>
                            <td>{cryptoPrices.binanceCoin ? `$${cryptoPrices.binanceCoin}` : 'Ładowanie...'}</td>
                        </tr>
                        <tr>
                            <td><img src={dogecoinIcon} alt="Dogecoin icon" style={{ width: '32px', height: '32px' }} /> Dogecoin (DOGE)</td>
                            <td>{cryptoPrices.dogecoin ? `$${cryptoPrices.dogecoin}` : 'Ładowanie...'}</td>
                        </tr>
                        <tr>
                            <td><img src={litecoinIcon} alt="Litecoin icon" style={{ width: '32px', height: '32px' }} /> Litecoin (LTC)</td>
                            <td>{cryptoPrices.litecoin ? `$${cryptoPrices.litecoin}` : 'Ładowanie...'}</td>
                        </tr>
                    </tbody>
                </table>

            </div>

        </div>
    );
};

export default Home;
