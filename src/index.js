import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Рендерим только публичное приложение (админ-панель удалена)
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

const renderApp = () => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Рендерим приложение
renderApp();

// Слушаем изменения URL для SPA навигации
window.addEventListener('popstate', renderApp);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
