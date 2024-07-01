import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as HashRouter, Route, Routes } from 'react-router-dom';
import App from './App';

// Use createRoot instead of ReactDOM.render
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/#/kingcongue" element={<App showNorth={true} showSouth={false} />} />
        <Route path="/#/deixaosgarotosbrincar" element={<App showNorth={false} showSouth={true} />} />
        <Route path="/#/peixesibito" element={<App showNorth={true} showSouth={true} />} />
        <Route path="/" element={<App showNorth={false} showSouth={false} />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);  