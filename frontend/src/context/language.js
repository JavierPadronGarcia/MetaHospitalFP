import React, { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';


export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(Cookies.get('userLanguage'));

  const changeLanguage = (lang) => {
    setLanguage(() => lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};