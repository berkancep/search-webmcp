import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Presentation from './Presentation';
import './style.css';

// Keep existing bookmarks while using a single presentation URL.
if (['/', '/sunum', '/sunum/'].includes(location.pathname)) {
  history.replaceState(
    null,
    '',
    '/presentation' + location.search + location.hash,
  );
}

const isDemo = location.pathname === '/demo' || location.pathname === '/demo/';
if (isDemo) document.title = 'Searchlab · Ayakkabı Koleksiyonu';
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{isDemo ? <App /> : <Presentation />}</React.StrictMode>,
);
