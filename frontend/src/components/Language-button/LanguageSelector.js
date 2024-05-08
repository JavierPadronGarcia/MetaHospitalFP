import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [showOptions, setShowOptions] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const languages = [
    { code: 'es', label: 'Español', flag: 'assets/icons/es.svg' },
    { code: 'en', label: 'English', flag: 'assets/icons/gb.svg' }
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
      <div className="selected-language" onClick={() => setShowOptions(!showOptions)}>
        <img src={languages.find(lang => lang.code === selectedLanguage)?.flag} alt={selectedLanguage} />
      </div>
      <div className={`language-options ${showOptions ? 'show' : ''}`}>
        {selectableLanguages.map(lang => (
          <div key={lang.code} className="language-option" onClick={() => changeLanguage(lang.code)}>
            <img src={lang.flag} alt={lang.code} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
