import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RolesProvider } from './context/roles';
import { UserContextProvider } from './context/user';
import Cookies from 'js-cookie';
import './index.css';

import reportWebVitals from './reportWebVitals';

import global_en from './translations/en/global.json';
import global_es from './translations/es/global.json';
import global_gl from './translations/gl/global.json';
import global_ca from './translations/ca/global.json';
import global_eu from './translations/eu/global.json';

import i18next from 'i18next';

import { I18nextProvider } from 'react-i18next';

let userLanguage = Cookies.get('userLanguage');

if (!userLanguage) {
  userLanguage = navigator.language.split('-')[0];

  Cookies.set("userLanguage",
    userLanguage,
    { expires: 365 }
  );
}

i18next.init({
  interpolation: { escapeValue: false },
  lng: userLanguage,
  resources: {
    en: {
      global: global_en
    },
    es: {
      global: global_es
    },
    gl: {
      global: global_gl
    },
    ca: {
      global: global_ca
    },
    eu: {
      global: global_eu
    },
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
