import { onSidebarToggle } from '../../../../utills';
import HamburgerIcon from '../../../../images/icons/hamburger-icon';
import React, { MutableRefObject } from 'react';
import { TFunction } from 'react-i18next';

interface IHeaderListEmails {
  t: TFunction<'translation', undefined>;
  emailRef: MutableRefObject<null>;
}

const HeaderListEmails: React.FC<IHeaderListEmails> = ({ t, emailRef }) => {
  return (
    <div
      ref={emailRef}
      className="headerinner ant-row ant-space-align-start ant-row-space-between">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="hamburgericon" onClick={onSidebarToggle}>
          <HamburgerIcon />
        </div>
        <div className="w-100 ant-row ant-space-vertical">
          <span className="ant-page-header-heading-title">
            {t('common.labels.emails')}
          </span>
          <span className="ant-page-header-heading-sub-title m-t-4">
            {t('common.labels.emails_subtitle')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeaderListEmails;
