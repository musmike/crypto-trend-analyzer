import React, { useEffect, lazy, Suspense } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';

// Lazy-load the heavy analytics view (Chart.js + Moment.js) for optimal bundle splitting
const Details = lazy(() => import('./components/Details'));

function App() {
    const user = localStorage.getItem("token");
    const location = useLocation();

    useEffect(() => {
        const pageTitle = getPageTitle(location.pathname);
        document.title = pageTitle;
    }, [location]);

    const getPageTitle = (path) => {
        switch (path) {
            case '/register':
                return 'Register | Crypto Trend Analyzer';
            case '/login':
                return 'Login | Crypto Trend Analyzer';
            case '/details':
                return 'Market Trend Analysis | Crypto Trend Analyzer';
            default:
                return 'Crypto Trend Analyzer';
        }
    };

    return (
        <div>
            <Navbar />
            <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '40px' }}>Loading...</div>}>
                <Routes>
                    {user && <Route path="/details" exact element={<Details />} />}
                    <Route path="/register" exact element={<Register />} />
                    <Route path="/login" exact element={<Login />} />
                    <Route path="/" exact element={<Home />} />
                    <Route path="/details" element={<Navigate replace to="/login" />} />
                </Routes>
            </Suspense>
        </div>
    );
}

export default App;