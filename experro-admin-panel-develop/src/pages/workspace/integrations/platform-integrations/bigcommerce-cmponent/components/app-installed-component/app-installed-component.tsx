import React from 'react';

import IntegrationsHeader from '../../../../header';
import useAppInstalledComponentController from './app-installed-component-controller';
import { ListBigcommerceStore } from '../bigcommerce-store';
import BigCommerceLogoIcon from '../../../../../../../images/icons/bigcommerce-logo-icon';
import { Modal } from 'antd';

const AppInstalledComponent = () => {
  const {
    t,
    onAppUninstallButtonClick,
    onBackButtonClick,
    isAppUninstallIsLoading,
    canUpdateEcommerceStore,
    isUninstallPlatformModalVisible,
    toggleUninstallModal,
    onVisitWebsiteButtonClick,
  } = useAppInstalledComponentController();
  return (
    <div>
      <IntegrationsHeader
        isListHeader={false}
        onBackButtonClick={onBackButtonClick}
        integrationName={t('common.labels.bigcommerce')}
        onAppUninstallButtonClick={() => toggleUninstallModal(true)}
        isAppInstalled={true}
        isAppUninstallIsLoading={isAppUninstallIsLoading}
        icon={<BigCommerceLogoIcon />}
        titleText={t('common.labels.bigcommerce_title_text')}
        installationGuideLink="https://support.experro.com/hc/en-us/articles/7925100805789"
        onVisitWebsiteButtonClick={onVisitWebsiteButtonClick}
        canInstallOrRemoveApp={canUpdateEcommerceStore() || false}
      />
      <ListBigcommerceStore />

      <Modal
        title={t('common.labels.uninstall_platform')}
        className="confirm-modal"
        open={isUninstallPlatformModalVisible}
        okText={t('common.labels.uninstall')}
        onOk={onAppUninstallButtonClick}
        okButtonProps={{ style: { background: 'red', border: 'red' } }}
        confirmLoading={isAppUninstallIsLoading}
        onCancel={() => toggleUninstallModal(false)}
        centered>
        <p>{t('common.messages.uninstall_platform')}</p>
      </Modal>
    </div>
  );
};
export default AppInstalledComponent;
