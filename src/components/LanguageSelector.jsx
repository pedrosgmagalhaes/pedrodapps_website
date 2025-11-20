import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactFlagsSelect from 'react-flags-select';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const baseLang = (lng) => String(lng || '').toLowerCase().split('-')[0];
  const countryFromLang = (lng) => {
    const map = { en: 'US', es: 'ES', pt: 'BR' };
    const key = baseLang(lng);
    return map[key] || 'US';
  };

  const langFromCountry = (code) => {
    const map = { US: 'en', ES: 'es', BR: 'pt' };
    return map[code] || 'en';
  };

  const changeLanguage = (code) => {
    const lang = langFromCountry(code);
    i18n.changeLanguage(lang);
    try {
      // Persiste para o detector manter a escolha
      window.localStorage?.setItem?.('i18nextLng', lang);
    } catch (e) {
      // Ignora falhas de acesso ao localStorage
      void e;
    }
  };

  return (
    <ReactFlagsSelect
      selected={countryFromLang(i18n.language)}
      onSelect={changeLanguage}
      countries={['US', 'ES', 'BR']}
      customLabels={{ US: 'English', ES: 'Español', BR: 'Português' }}
      placeholder="Select language"
      showSelectedLabel={false}
      showOptionLabel={true}
      selectButtonClassName="language-flag-circle"
      className="language-selector-dropdown"
      aria-label="Selecione o idioma"
    />
  );
};

export default LanguageSelector;