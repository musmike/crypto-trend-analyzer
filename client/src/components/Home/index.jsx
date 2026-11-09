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
                const response = await axios.get(
                    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,dogecoin,litecoin&vs_currencies=usd'
                );
                setCryptoPrices({
                    bitcoin: response.data.bitcoin?.usd,
                    ethereum: response.data.ethereum?.usd,
                    binanceCoin: response.data.binancecoin?.usd,
                    dogecoin: response.data.dogecoin?.usd,
                    litecoin: response.data.litecoin?.usd
                });
            } catch (error) {
                console.error('Error fetching live crypto prices:', error);
            }
        };

        fetchCryptoPrices();
    }, []);

    return (
        <div className={styles.home_container}>
            <div className={styles.content_container}>
                <div className={styles.left_container}>
                    <h1>Cryptocurrencies Overview</h1>
                    <p>
                        Cryptocurrencies are digital or virtual assets secured by cryptographic systems.
                        Below are the key digital assets tracked in this analytics platform:
                    </p>
                    <ul>
                        <li>
                            <strong>Bitcoin (BTC)</strong> — The first and most established cryptocurrency, created in 2009 by Satoshi Nakamoto. Often referred to as "digital gold".
                        </li>
                        <li>
                            <strong>Ethereum (ETH)</strong> — A decentralized platform powering smart contracts and decentralized finance (DeFi), created in 2015 by Vitalik Buterin.
                        </li>
                        <li>
                            <strong>Binance Coin (BNB)</strong> — The native utility token of the Binance ecosystem, used for fee discounts and network transactions.
                        </li>
                        <li>
                            <strong>Dogecoin (DOGE)</strong> — An open-source peer-to-peer cryptocurrency initially created as a lighthearted meme coin that grew into a widely recognized digital currency.
                        </li>
                        <li>
                            <strong>Litecoin (LTC)</strong> — Introduced in 2011 by Charlie Lee as a lighter, faster alternative to Bitcoin, often described as "silver to Bitcoin's gold".
                        </li>
                    </ul>
                </div>

                <div className={styles.right_container}>
                    <h2>Live Market Prices (USD):</h2>
                    <table className={styles.crypto_table}>
                        <tbody>
                            <tr>
                                <td><img src={bitcoinIcon} alt="Bitcoin" /> Bitcoin (BTC)</td>
                                <td>{cryptoPrices.bitcoin ? `$${cryptoPrices.bitcoin.toLocaleString()}` : 'Loading...'}</td>
                            </tr>
                            <tr>
                                <td><img src={ethereumIcon} alt="Ethereum" /> Ethereum (ETH)</td>
                                <td>{cryptoPrices.ethereum ? `$${cryptoPrices.ethereum.toLocaleString()}` : 'Loading...'}</td>
                            </tr>
                            <tr>
                                <td><img src={binanceCoinIcon} alt="Binance Coin" /> Binance Coin (BNB)</td>
                                <td>{cryptoPrices.binanceCoin ? `$${cryptoPrices.binanceCoin.toLocaleString()}` : 'Loading...'}</td>
                            </tr>
                            <tr>
                                <td><img src={dogecoinIcon} alt="Dogecoin" /> Dogecoin (DOGE)</td>
                                <td>{cryptoPrices.dogecoin ? `$${cryptoPrices.dogecoin.toLocaleString()}` : 'Loading...'}</td>
                            </tr>
                            <tr>
                                <td><img src={litecoinIcon} alt="Litecoin" /> Litecoin (LTC)</td>
                                <td>{cryptoPrices.litecoin ? `$${cryptoPrices.litecoin.toLocaleString()}` : 'Loading...'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Home;