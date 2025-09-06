import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// We have removed the line that was trying to import 'reportWebVitals'.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// We have also removed the function call to reportWebVitals from the end of the file.