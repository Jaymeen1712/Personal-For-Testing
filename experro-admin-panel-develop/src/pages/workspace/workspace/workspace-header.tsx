import React from 'react';
import { TFunction } from 'react-i18next';

import { onSidebarToggle } from '../../../utills';
import HamburgerIcon from '../../../images/icons/hamburger-icon';

interface IWorkspaceHeader {
  isButtonDisable: boolean;
  t: TFunction<'translation', undefined>;
}

const WorkspaceHeader: React.FC<IWorkspaceHeader> = ({
  isButtonDisable,
  t,
}) => {
  return (
    <div className="headerinner ant-row ant-space-align-start ant-row-space-between ">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="hamburgericon" onClick={onSidebarToggle}>
          <HamburgerIcon />
        </div>
        <div className="w-100 ant-row ant-space-vertical">
          <span className="ant-page-header-heading-title">
            {isButtonDisable
              ? t('common.labels.workspace')
              : t('common.labels.edit_workspace')}
          </span>
          <span className="ant-page-header-heading-sub-title m-t-4">
            {t('common.labels.manage_your_workspace_settings')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceHeader;
