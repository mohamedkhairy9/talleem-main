import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './api/queryClient';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import useLanguageStore from './utils/stores/language.store';

export default function App() {
    const { initializeLanguage } = useLanguageStore();

    useEffect(() => {
        initializeLanguage();
    }, [initializeLanguage]);

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <BrowserRouter>
                <ToastContainer autoClose={1000} />
                <AppRoutes />
            </BrowserRouter>
        </QueryClientProvider>
    );
}
