import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './tailwind.css';   // Tailwind first
import './style.css';      // Your custom styles after

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);