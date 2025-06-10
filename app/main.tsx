import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

if (import.meta.hot) {
  import.meta.hot.accept();
}

import { AuthProvider } from './lib/contexts/AuthContext';
import { NotificationProvider } from './lib/contexts/NotificationContext';
import { ThemeProvider } from './components/theme-provider';
import AppRoutes from './routes';
import './globals.css';
import './app.css';

// Loading component for suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Get default theme from local storage or use system
const getDefaultTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  return (savedTheme as 'light' | 'dark' | 'system' | null) || 'system';
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider attribute="class" defaultTheme={getDefaultTheme()} enableSystem>
    <AuthProvider>
      <BrowserRouter>
        <NotificationProvider>
          <Suspense fallback={<Loading />}>
            <AppRoutes />
          </Suspense>
        </NotificationProvider>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
); 