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

    handleHashChange();
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
        <Route path="vietnam/kingcongue" element={<App conflict={"vietnam"} showBLUFOR={false} showREDFOR={true}/>} />
        <Route path="vietnam/deixaosgarotosbrincar" element={<App conflict={"vietnam"} showBLUFOR={true} showREDFOR={false}/>} />
        <Route path="vietnam/peixesibito" element={<App conflict={"vietnam"} showBLUFOR={true} showREDFOR={true}/>} />
        <Route path="vietnam/*" element={<App conflict={"vietnam"} showBLUFOR={false} showREDFOR={false}/>} />

        <Route path="pernambuco/rebeldes" element={<App conflict={"pernambuco"} showBLUFOR={false} showREDFOR={true}/>} />
        <Route path="pernambuco/brasil" element={<App conflict={"pernambuco"} showBLUFOR={true} showREDFOR={false}/>} />
        <Route path="pernambuco/diretoria" element={<App conflict={"pernambuco"} showBLUFOR={true} showREDFOR={true}/>} />
        <Route path="pernambuco/*" element={<App conflict={"pernambuco"} showBLUFOR={false} showREDFOR={false}/>} />
        
        <Route path="*" element={<App showNorth={false} showSouth={false} />} />
      </Routes> 
    </HashRouter>
  </React.StrictMode>
);

createRoot(document.getElementById('root')).render(<Root />);
