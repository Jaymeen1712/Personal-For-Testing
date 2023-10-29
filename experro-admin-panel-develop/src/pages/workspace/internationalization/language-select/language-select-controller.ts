import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ILanguage } from '../../../../types';
import { useListLanguages } from '../services';

const useLanguageSelect = ({
  selectedLanguages,
}: {
  selectedLanguages: ILanguage[];
}) => {
  const { t } = useTranslation();
  const listLanguage = useListLanguages();

  const languages = useMemo(
    () =>
      listLanguage.data
        ? listLanguage.data.filter(
            (language) =>
              selectedLanguages.findIndex(
                (selectedLanguage) =>
                  selectedLanguage.locale === language.locale
              ) === -1
          )
        : [],
    [listLanguage.data, selectedLanguages]
  );

  return {
    t,
    languages,
  };
};

export default useLanguageSelect;
