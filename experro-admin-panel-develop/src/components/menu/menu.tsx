import React from 'react';
import { Menu as AntdMenu, Modal } from 'antd';

import Logo from '../../images/icons/logo';
import useMenuController from './menu-controller';
import SwitchOrganizationMenu from './switch-organization';
import TwoFactorEmailValidate from './two-factor-email-validate';
import TwoFactorAuthenticateAppValidate from './two-factor-authenticate-app-validate';

interface MenuProps {
  isGlobalPage?: boolean;
  sidebarActiveItemKey: string;
}

const Menu: React.FC<MenuProps> = ({
  isGlobalPage = false,
  sidebarActiveItemKey,
}) => {
  const {
    menuItems,
    userMenuItems,
    onMenuItemClick,
    isVisibleSwitchOrganizationModal,
    linksOrganization,
    t,
    history,
    workspaceId,
    selectedOrganizationData,
    hideSwitchOrganizationModal,
    form,
    onSubmitOrganization,
    onSwitchOrganization,
    isSwitchButtonVisible,
    preference,
    authenticationUsingEmail,
    authenticationUsingApp,
    authenticationUsingBoth,
    twoFactorUsingEmail,
    onTwoFactorAuthenticationUsingEmail,
    onResendCode,
    onHideEmailAuthentication,
    onSwitchToAuthAppAuthentication,
    twoFactorAuthenticationUsingAuthApp,
    onTwoFactorAuthenticationUsingApp,
    onHideAppAuthentication,
    onGoBack,
    onAuthenticateUsingRecoverykey,
    isRecoveryKeyVisible,
    onSwitchToAuthEmailAuthentication,
    onHideBothAuthentication,
    onTwoFactorAuthenticationUsingBoth,
  } = useMenuController({
    isGlobalPage,
    sidebarActiveItemKey,
  });

  return (
    <>
      <div className="iconmenu">
        <div>
          {workspaceId ? (
            <div
              className="sidebar-logo cursor-pointer"
              onClick={() => {
                history.push(`/workspaces/${workspaceId}/dashboard/traffic`);
              }}>
              <Logo />
            </div>
          ) : (
            <div
              className="sidebar-logo cursor-pointer"
              onClick={() => {
                history.push('/workspaces');
              }}>
              <Logo />
            </div>
          )}

          <AntdMenu
            onClick={onMenuItemClick}
            mode="inline"
            selectedKeys={[sidebarActiveItemKey]}
            defaultSelectedKeys={[sidebarActiveItemKey]}
            items={menuItems}
          />
        </div>

        <AntdMenu
          onClick={onMenuItemClick}
          mode="inline"
          items={userMenuItems}
        />
      </div>

      <SwitchOrganizationMenu
        isVisibleSwitchOrganizationModal={isVisibleSwitchOrganizationModal}
        t={t}
        hideSwitchOrganizationModal={hideSwitchOrganizationModal}
        isSwitchButtonVisible={isSwitchButtonVisible}
        onSubmitOrganization={onSubmitOrganization}
        form={form}
        linksOrganization={linksOrganization.data}
        selectedOrganizationData={selectedOrganizationData}
        onSwitchOrganization={onSwitchOrganization}
      />

      <Modal
        className="CustomModal CustomModal-small"
        title={t('common.labels.two_factor_auth')}
        centered
        open={authenticationUsingEmail}
        onOk={onTwoFactorAuthenticationUsingEmail}
        onCancel={onHideEmailAuthentication}>
        <TwoFactorEmailValidate
          t={t}
          twoFactorUsingEmail={twoFactorUsingEmail}
          onResendCode={onResendCode}
          authenticationUsingBoth={authenticationUsingBoth}
          preference={preference}
          onSwitchToAuthAppAuthentication={onSwitchToAuthAppAuthentication}
        />
      </Modal>

      <Modal
        className="CustomModal CustomModal-small"
        title={t('common.labels.two_factor_auth')}
        centered
        open={authenticationUsingApp}
        onOk={onTwoFactorAuthenticationUsingApp}
        onCancel={onHideAppAuthentication}>
        <TwoFactorAuthenticateAppValidate
          t={t}
          twoFactorAuthenticationUsingAuthApp={
            twoFactorAuthenticationUsingAuthApp
          }
          isRecoveryKeyVisible={isRecoveryKeyVisible}
          authenticationUsingBoth={authenticationUsingBoth}
          preference={preference}
          onGoBack={onGoBack}
          onSwitchToAuthEmailAuthentication={onSwitchToAuthEmailAuthentication}
          onAuthenticateUsingRecoverykey={onAuthenticateUsingRecoverykey}
        />
      </Modal>

      <Modal
        className="CustomModal CustomModal-small"
        title={t('common.labels.two_factor_auth')}
        centered
        open={authenticationUsingBoth}
        onCancel={onHideBothAuthentication}
        onOk={onTwoFactorAuthenticationUsingBoth}>
        {preference === 'email' ? (
          <TwoFactorEmailValidate
            t={t}
            twoFactorUsingEmail={twoFactorUsingEmail}
            onResendCode={onResendCode}
            authenticationUsingBoth={authenticationUsingBoth}
            preference={preference}
            onSwitchToAuthAppAuthentication={onSwitchToAuthAppAuthentication}
          />
        ) : (
          preference === 'authenticator_app' && (
            <TwoFactorAuthenticateAppValidate
              t={t}
              twoFactorAuthenticationUsingAuthApp={
                twoFactorAuthenticationUsingAuthApp
              }
              isRecoveryKeyVisible={isRecoveryKeyVisible}
              authenticationUsingBoth={authenticationUsingBoth}
              preference={preference}
              onGoBack={onGoBack}
              onSwitchToAuthEmailAuthentication={
                onSwitchToAuthEmailAuthentication
              }
              onAuthenticateUsingRecoverykey={onAuthenticateUsingRecoverykey}
            />
          )
        )}
      </Modal>
    </>
  );
};

export default Menu;
