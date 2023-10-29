import React from 'react';
import { TFunction } from 'react-i18next';
import { Button } from 'antd';

// import { onSidebarToggle } from '../../../../utills';
// import HamburgerIcon from '../../../../images/icons/hamburger-icon';
// import PlusCircleIcon from '../../../../images/icons/pluscircle-icon';
// import PlusNoborder from '../../../../images/icons/plus-no-border';
import PlusIcon from '../../../../images/icons/plus-icon';

interface IHeaderListWorkspaces {
  t: TFunction<'translation', undefined>;
  onCreateWorkspace: () => void;
  canManageGlobalWorkspace: boolean;
}

const HeaderListWorkspaces: React.FC<IHeaderListWorkspaces> = ({
  t,
  onCreateWorkspace,
  canManageGlobalWorkspace,
}) => {
  return (
    <div className="headerinner ant-row ant-row-top ant-row-space-between ">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="w-100 ant-row ant-space-vertical">
          <span className="ant-page-header-heading-title">
            {t('common.labels.workspaces')}
          </span>
          <span className="ant-page-header-heading-sub-title m-t-4">
            {t('common.labels.workspace_subheader')}
          </span>
        </div>
      </div>
      <div className="headerright">
        <div className="ant-row ant-row-end">
          <div className="ant-row ant-row-end">
            {canManageGlobalWorkspace && (
              <Button
                type="primary"
                htmlType="button"
                icon={
                  <span className="anticon">
                    <PlusIcon />
                  </span>
                }
                onClick={onCreateWorkspace}>
                {t('common.labels.add_workspace')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderListWorkspaces;
