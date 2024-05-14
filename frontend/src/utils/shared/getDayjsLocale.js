import Cookies from 'js-cookie';

import es from 'dayjs/locale/es';
import en from 'dayjs/locale/en';
import gl from 'dayjs/locale/gl';
import ca from 'dayjs/locale/ca';

const useDayjsLocale = () => {
  const userLanguage = Cookies.get('userLanguage');

  switch (userLanguage) {
    case 'es':
      return es
    case 'en':
      return en
    case 'gl':
      return gl
    case 'ca':
      return ca
    default:
      return es
  }
}

export default useDayjsLocale;