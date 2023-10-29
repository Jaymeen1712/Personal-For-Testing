import React from 'react';
import { TFunction } from 'react-i18next';
import { Button } from 'antd';

import HamburgerIcon from '../../../../images/icons/hamburger-icon';
import PlusIcon from '../../../../images/icons/plus-icon';
import { onSidebarToggle } from '../../../../utills';

interface IHeaderListRole {
  t: TFunction<'translation', undefined>;
  onAddRole: () => void;
}

const HeaderListRole: React.FC<IHeaderListRole> = ({ t, onAddRole }) => {
  return (
    <div className="headerinner ant-row ant-space-align-start ant-row-space-between ">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="hamburgericon" onClick={onSidebarToggle}>
          <HamburgerIcon />
        </div>
        <div className="w-100 ant-row ant-space-vertical">
          <span className="ant-page-header-heading-title">
            {t('common.labels.roles')}
          </span>
          <span className="ant-page-header-heading-sub-title m-t-4">
            {t('common.labels.role-list-subtitle')}
          </span>
        </div>
      </div>
      <div className="headerright">
        <div className="ant-row ant-row-end">
          <Button type="primary" icon={<span className="anticon"><PlusIcon /></span>} onClick={onAddRole}>
            {t('common.labels.add_role')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeaderListRole;
