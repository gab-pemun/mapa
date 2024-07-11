import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import App from './App';

const RouteLogger = () => {
  const location = useLocation();

  useEffect(() => {
    console.log('Current path:', location.pathname + location.search + location.hash);
  }, [location]);

  return null;
};

const HashLogger = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleHashChange = () => {
      const newPath = window.location.hash.substring(1);
      if (newPath) {
        navigate(newPath);
      } else {
        navigate('/');
      }
    };

    handleHashChange(); // Run on mount to navigate to the initial hash path
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [navigate]);

  return null;
};

const Root = () => (
  <React.StrictMode>
    <HashRouter>
      <HashLogger />
      <Routes>
        <Route path="/kingcongue" element={<App showNorth={true} showSouth={false} />} />
        <Route path="/deixaosgarotosbrincar" element={<App showNorth={false} showSouth={true} />} />
        <Route path="/peixesibito" element={<App showNorth={true} showSouth={true} />} />
        <Route path="/pernambuco" element={<App showNorth={true} showSouth={true} vietnam={false} />} />
        <Route path="/" element={<App showNorth={false} showSouth={false} />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

createRoot(document.getElementById('root')).render(<Root />);
