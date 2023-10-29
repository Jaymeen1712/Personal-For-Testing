import { Button } from 'antd';
import React from 'react';
import { TFunction } from 'react-i18next';

import { onSidebarToggle } from '../../../../utills';
import HamburgerIcon from '../../../../images/icons/hamburger-icon';
import PlusIcon from '../../../../images/icons/plus-icon';

interface IHeaderListGroup {
  t: TFunction<'translation', undefined>;
  onAddGroup: () => void;
}

const HeaderListGroup: React.FC<IHeaderListGroup> = ({ t, onAddGroup }) => {
  return (
    <div className="headerinner ant-row ant-space-align-start ant-row-space-between ">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="hamburgericon" onClick={onSidebarToggle}>
          <HamburgerIcon />
        </div>
        <div className="w-100 ant-row ant-space-vertical">
          <span className="ant-page-header-heading-title">
            {t('common.labels.groups')}
          </span>
          <span className="ant-page-header-heading-sub-title m-t-4">
            {t('common.labels.groups_subheader')}
          </span>
        </div>
      </div>
      <div className="headerright">
        <div className="ant-row ant-row-end">
          <Button type="primary" htmlType="button" onClick={onAddGroup} icon={<span className="anticon"><PlusIcon /></span>}>
            {t('common.labels.add_group')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeaderListGroup;
