import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import CryptoTable from './components/Details/CryptoTable';
import EventInfluenceTables from './components/Details/EventInfluenceTables';

const mockCryptoData = [
    { coin: 'BTC', date: '2022-11-29', value: 16000 },
    { coin: 'BTC', date: '2022-11-30', value: 17000 },
    { coin: 'BTC', date: '2022-12-01', value: 18700 },
    { coin: 'ETH', date: '2022-11-30', value: 1200 }
];

const mockEventsData = [
    {
        name: 'OpenAI Releases ChatGPT',
        date: '2022-11-30',
        type: 'Technology'
    }
];

describe('Crypto Trend Analyzer - Frontend Unit Tests', () => {
    test('renders Navbar with English navigation links', () => {
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        expect(screen.getByText(/Crypto Trend Analyzer/i)).toBeInTheDocument();
        expect(screen.getByText(/Home/i)).toBeInTheDocument();
        expect(screen.getByText(/Trend Analysis/i)).toBeInTheDocument();
        expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    });

    test('renders CryptoTable with formatted prices and dates', () => {
        render(<CryptoTable cryptocurrencyData={mockCryptoData} />);

        expect(screen.getByText('2022-11-30')).toBeInTheDocument();
        expect(screen.getByText('$17,000')).toBeInTheDocument();
        expect(screen.getByText('$1,200')).toBeInTheDocument();
    });

    test('calculates and renders EventInfluenceTables percentage changes', () => {
        render(
            <EventInfluenceTables
                cryptocurrencyData={mockCryptoData}
                eventsData={mockEventsData}
            />
        );

        // Verify category and event name rendering
        expect(screen.getByText(/Category: Technology/i)).toBeInTheDocument();
        expect(screen.getByText(/OpenAI Releases ChatGPT/i)).toBeInTheDocument();

        // BTC on 2022-11-30 was $17,000; +1 day (2022-12-01) was $18,700 (+10.00%)
        expect(screen.getByText('$17,000')).toBeInTheDocument();
        expect(screen.getByText(/10.00%/i)).toBeInTheDocument();
    });

    test('handles pagination controls in CryptoTable', () => {
        render(<CryptoTable cryptocurrencyData={mockCryptoData} />);

        const prevButton = screen.getByText(/Previous/i);
        expect(prevButton).toBeDisabled();
    });
});