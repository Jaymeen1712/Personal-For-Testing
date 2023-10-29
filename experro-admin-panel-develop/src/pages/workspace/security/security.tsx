import { Tabs } from 'antd';
import React from 'react';

import ChangePassword from './change-password';
import {
  onSidebarToggle,
  SIDEBAR_KEYS,
  SUB_SIDEBAR_KEYS,
} from '../../../utills';
import TwoFactorAuthenticationSecurity from './two-factor-authentication';
import SubSideBar from '../../../components/sub-sidebar';
import HamburgerIcon from '../../../images/icons/hamburger-icon';
import useSecurityController from './security-controller';

const { TabPane } = Tabs;

interface ISecurity {
  onMainSidebarActiveItem?: (val: string) => void;
}

const Security: React.FC<ISecurity> = ({ onMainSidebarActiveItem }) => {
  const { t } = useSecurityController({ onMainSidebarActiveItem });

  return (
    <div className="page-wrapper">
      <SubSideBar
        sidebarActiveItemKey={SIDEBAR_KEYS.USER.ACCOUNT}
        subSidebarActiveItemKey={SUB_SIDEBAR_KEYS.USER.ACCOUNT.SECURITY}>
        <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
          <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
            <div className="hamburgericon" onClick={onSidebarToggle}>
              <HamburgerIcon />
            </div>
            <div className="w-100 ant-row ant-space-vertical">
              <span className="ant-page-header-heading-title">
                {t('common.labels.change_password_header')}
              </span>
              <span className="ant-page-header-heading-sub-title m-t-4">
                {t('common.labels.change_password_subtitle')}
              </span>
            </div>
          </div>
        </div>
        <Tabs defaultActiveKey="change password" className="m-0 security-tab">
          <TabPane
            tab={t('common.labels.change_password_tab')}
            key="change password">
            <ChangePassword />
          </TabPane>

          <TabPane
            tab={t('common.labels.two_factor_authentication')}
            key="two factor authentication">
            <TwoFactorAuthenticationSecurity />
          </TabPane>
        </Tabs>
      </SubSideBar>
    </div>
  );
};
export default Security;
