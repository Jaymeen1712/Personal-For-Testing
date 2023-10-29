import React from 'react';
import { TFunction } from 'react-i18next';

import HamburgerIcon from '../../../images/icons/hamburger-icon';
import { onSidebarToggle } from '../../../utills';

interface IHeaderListTheme {
  t: TFunction<'translation', undefined>;
}

const HeaderListTheme: React.FC<IHeaderListTheme> = ({ t }) => {
  return (
    <div className="headerinner ant-row ant-space-align-start ant-row-space-between ">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="hamburgericon" onClick={onSidebarToggle}>
          <HamburgerIcon />
        </div>
        <div className="w-100 ant-row ant-space-vertical">
          <span className="ant-page-header-heading-title">
            {t('common.labels.theme')}
          </span>
          <span className="ant-page-header-heading-sub-title m-t-4">
            {t('common.labels.list_theme')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeaderListTheme;
