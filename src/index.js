import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

$.ajaxSetup({
    baseURL: 'https://..../app/v1',
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
