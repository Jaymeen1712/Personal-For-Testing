import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Space } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
// import { useTranslation } from 'react-i18next';

import i18n from '../../i18n';
import { IFilter } from '../../types';

const Internationlization: React.FC = () => {
  const [value, setValue] = useState('');
  // const { t } = useTranslation();

  const LANGUAGES = [
      {
        label: `English`,
        code: 'en',
        key: '1',
      },
      {
        label: `Deutsch`,
        code: 'de',
        key: '2',
      },
      {
        label: `Español`,
        code: 'es',
        key: '3',
      },
    ]

  useEffect(() => {
   setTimeout(()=>{
     const currentLangValue = i18n.language;
     const language = LANGUAGES.find((lang) => lang.code === currentLangValue);
     if (language) {
       setValue(language.key);
     }
   },3)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const onClick = ({ key }: { key: string }) => {
    if (key === '1') {
      i18n.changeLanguage('en').then((r) => console.log(r));
    } else if (key === '2') {
      i18n.changeLanguage('de').then((r) => console.log(r));
    } else if (key === '3') {
      i18n.changeLanguage('es').then((r) => console.log(r));
    }
    setValue(key);
  };

  let result;
  LANGUAGES.forEach((ele: IFilter) => {
    if (ele.key === value) {
      result = ele.label;
    }
  });

  return (
    <Dropdown
      overlay={<Menu onClick={onClick} items={LANGUAGES} />}
      placement="bottomLeft">
      <Space>
        {result ? result : 'English'}
        <CaretDownOutlined />
      </Space>
    </Dropdown>
  );
};

export default Internationlization;
