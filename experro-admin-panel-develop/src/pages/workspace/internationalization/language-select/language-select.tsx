import React from 'react';
import { Select } from 'antd';

import useLanguageSelect from './language-select-controller';
import { ILanguage } from '../../../../types';
import DownArrowIcon from '../../../../images/icons/downarrow-icon';

interface LanguageDropDownProps {
  value: string;
  onChange: (value: string) => void;
  selectedLanguages: ILanguage[];
}

const LanguageSelect: React.FC<LanguageDropDownProps> = ({
  value,
  onChange,
  selectedLanguages,
}) => {
  const { t, languages } = useLanguageSelect({
    selectedLanguages,
  });

  return (
    <div>
      <Select
        showSearch
        optionFilterProp="children"
        style={{ width: 420 }}
        placeholder={t('common.labels.add_language_placeholder')}
        value={value}
        onChange={onChange}
        suffixIcon={<DownArrowIcon />}>
        {languages.map((language) => (
          <Select.Option value={language.id} key={language.id}>
            {`${language.name} (${language.locale})`}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default LanguageSelect;
