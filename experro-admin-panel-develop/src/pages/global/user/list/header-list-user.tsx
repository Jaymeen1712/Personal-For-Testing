import React from 'react';
import { TFunction } from 'react-i18next';
import { Button } from 'antd';

import HamburgerIcon from '../../../../images/icons/hamburger-icon';
import PlusIcon from '../../../../images/icons/plus-icon';
import { onSidebarToggle } from '../../../../utills';

interface IHeaderListUser {
  t: TFunction<'translation', undefined>;
  onAddUserClick: () => void;
}

const HeaderListUser: React.FC<IHeaderListUser> = ({ t, onAddUserClick }) => {
  return (
    <div className="headerinner ant-row ant-space-align-start ant-row-space-between ">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="hamburgericon" onClick={onSidebarToggle}>
          <HamburgerIcon />
        </div>
        <div className="w-100 ant-row ant-space-vertical">
          <span className="ant-page-header-heading-title">
            {t('common.labels.users')}
          </span>
          <span className="ant-page-header-heading-sub-title m-t-4">
            {t('common.labels.list_of_users')}
          </span>
        </div>
      </div>
      <div className="headerright">
        <div className="ant-row ant-row-end">
          <Button
            icon={<PlusIcon />}
            id={t('common.labels.add_user')}
            type="primary"
            onClick={onAddUserClick}>
            {t('common.labels.add_user')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeaderListUser;
