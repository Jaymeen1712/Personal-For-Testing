import React from 'react';
import { Button, Table, Modal, Tooltip, Spin } from 'antd';

import useAppInstalledComponentController from './app-installed-component-controller';
import ShopifyLogoIcon from '../../../../../../../images/icons/shopify-logo-icon';
import IntegrationsHeader from '../../../../header/integration-header';
import NoDataFound from '../../../../../../../components/no-data-found/no-data-found';
import NoRecordIcon from '../../../../../../../images/icons/no-records-icon';
import { LoadingOutlined } from '@ant-design/icons';

const AppInstalledComponent = () => {
  const {
    onAppUninstallButtonClick,
    onBackButtonClick,
    t,
    isAppUninstallIsLoading,
    getShopifyStoreList,
    columns,
    onAddNewStoreButtonClick,
    isUninstallPlatformModalVisible,
    toggleUninstallModal,
    onVisitWebsiteButtonClick,
    isDeleteModalVisible,
    toggleRemoveStoreModal,
    deleteShopifyStore,
    isDeleteStoreBtnLoading,
    listEnvironment,
    storeEnvironments,
    canUpdateEcommerceStore,
    canCreateEcommerceStore,
    canReadEcommerceStore,
  } = useAppInstalledComponentController();
  return (
    <div>
      <IntegrationsHeader
        isListHeader={false}
        onBackButtonClick={onBackButtonClick}
        integrationName={t('common.labels.shopify_title_text')}
        onAppUninstallButtonClick={() => toggleUninstallModal(true)}
        isAppInstalled={true}
        isAppUninstallIsLoading={isAppUninstallIsLoading}
        icon={<ShopifyLogoIcon />}
        titleText={t('common.labels.shopify_title_text')}
        onVisitWebsiteButtonClick={onVisitWebsiteButtonClick}
        canInstallOrRemoveApp={canUpdateEcommerceStore() || false}
        installationGuideLink={
          'https://support.experro.com/hc/en-us/articles/12024213786269'
        }
      />
      <div className="ant-row ant-row-space-between m-t-32 m-b-40">
        {canCreateEcommerceStore() && (
          <>
            <div className="app-connect-title">
              <h4 className="title-default m-b-8">
                {t('common.labels.connected_store')}
              </h4>
              <p className="gray-text m-0">
                {t('common.labels.manage_store_subtitle', {
                  entity: 'Shopify',
                })}
              </p>
            </div>
            <div>
              <Tooltip
                placement="topRight"
                title={
                  listEnvironment.data?.length === storeEnvironments.length &&
                  'Stores are connected in all environment.'
                }>
                <Button
                  disabled={
                    listEnvironment.data?.length === storeEnvironments.length
                  }
                  type="primary"
                  onClick={onAddNewStoreButtonClick}>
                  {t('common.labels.add_store')}
                </Button>
              </Tooltip>
            </div>
          </>
        )}
      </div>
      {getShopifyStoreList.data&&getShopifyStoreList.isFetched && canReadEcommerceStore() ? (
        <>
          {getShopifyStoreList.data.length > 0 ? (
            <div className="shopify-store-list table-section">
              <Table
                pagination={false}
                dataSource={getShopifyStoreList.data}
                columns={columns}
              />
            </div>
          ) : (
            <NoDataFound
              icon={<NoRecordIcon />}
              title={t('common.labels.no_store_added')}
              description={'Add Shopify stores to Experro'}
            />
          )}
        </>
      ) : (
        <>
          <Spin
            className="HV-center table-center"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
        </>
      )}
      <Modal
        title={t('common.labels.uninstall_platform')}
        className="confirm-modal"
        open={isUninstallPlatformModalVisible}
        okText={t('common.labels.uninstall')}
        onOk={onAppUninstallButtonClick}
        confirmLoading={isAppUninstallIsLoading}
        onCancel={() => toggleUninstallModal(false)}
        okButtonProps={{ style: { background: 'red', border: 'red' } }}
        centered>
        <p>{t('common.messages.uninstall_platform')}</p>
      </Modal>
      <Modal
        title={t('common.labels.remove_store')}
        open={isDeleteModalVisible}
        className="confirm-modal"
        onCancel={() => toggleRemoveStoreModal(false)}
        onOk={deleteShopifyStore}
        okButtonProps={{ style: { background: 'red', border: 'red' } }}
        okText={t('common.labels.remove')}
        confirmLoading={isDeleteStoreBtnLoading}
        centered>
        <p>{t('common.messages.delete_store_message')}</p>
      </Modal>
    </div>
  );
};
export default AppInstalledComponent;
