import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

// ✅ Service Worker registration (for notifications)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals();
