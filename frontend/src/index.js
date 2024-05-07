import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RolesProvider } from './context/roles';
import { UserContextProvider } from './context/user';
import './index.css';

import reportWebVitals from './reportWebVitals';

import global_en from './translations/en/global.json';
import global_es from './translations/es/global.json';

import i18next from 'i18next';

import { I18nextProvider } from 'react-i18next';

i18next.init({
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: {
    en: {
      global: global_en
    },
    es: {
      global: global_es
    }
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RolesProvider>
    <I18nextProvider i18n={i18next}>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </I18nextProvider>
  </RolesProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
