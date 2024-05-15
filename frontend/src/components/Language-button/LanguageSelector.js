import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [showOptions, setShowOptions] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const languages = [
    { code: 'gl', label: 'Galego', flag: '/assets/icons/Flag_of_Galicia.svg' },
    { code: 'eu', label: 'Euskera', flag: '/assets/icons/Flag_of_the_Basque_Country.svg' },
    { code: 'ca', label: 'Catala', flag: '/assets/icons/Flag_of_Catalonia.svg' },
    { code: 'en', label: 'English', flag: 'assets/icons/gb.svg' },
    { code: 'es', label: 'Español', flag: 'assets/icons/es.svg' }
  ];

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(() => {
      Cookies.set("userLanguage",
        language,
        { expires: 365 }
      );
      return language;
    });
    setShowOptions(false);
  };

  const selectableLanguages = languages.filter(lang => lang.code !== selectedLanguage);

  return (
    <div className="language-selector-container">
      <div className="selected-language" >
        <img src={languages.find(lang => lang.code === selectedLanguage)?.flag} alt={selectedLanguage} onClick={() => setShowOptions(!showOptions)} />
      </div>
      <div className={`language-options ${showOptions ? 'show' : ''}`}>
        {selectableLanguages.map(lang => (
          <div key={lang.code} className="language-option">
            <img src={lang.flag} alt={lang.code} onClick={() => changeLanguage(lang.code)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
