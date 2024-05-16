import Cookies from 'js-cookie';

import es from 'antd/locale/es_ES';
import en from 'antd/locale/en_GB';
import gl from 'antd/locale/gl_ES';
import eu from 'antd/locale/eu_ES';
import ca from 'antd/locale/ca_ES';

const locales = {
  en: en,
  es: es,
  gl: gl,
  eu: eu,
  ca: ca
};

const useAntDLocale = (language) => {
  return locales[language] || locales[Cookies.get('userLanguage')] || es;
};

export default useAntDLocale;