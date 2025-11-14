import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

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

// Метрики производительности отключены
