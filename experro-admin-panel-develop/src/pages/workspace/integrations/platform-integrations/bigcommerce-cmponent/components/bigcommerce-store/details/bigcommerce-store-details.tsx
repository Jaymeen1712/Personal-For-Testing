import React from 'react';
import { Tabs, Modal } from 'antd';

import { Overview, SyncLogs } from '../components';
import useBigcommerceStoreDetailsController from './bigcommerce-store-details-controller';
import ArrowLeftIcon from '../../../../../../../../images/icons/arrow-left-icon';

const DetailsBigcommerceStore: React.FC = () => {
  const {
    t,
    isSyncFailed,
    storeName,
    storeDetails,
    user,
    userName,
    lastSynced,
    removeBigcommerceStore,
    deleteBigcommerceStore,
    getStoreStatistics,
    onReSyncStore,
    refreshStoreSyncLog,
    allLogs,
    isDeleteModalVisible,
    storeSyncLogs,
    goToStoreListPage,
    isSyncButtonDisabled,
    isSyncModalVisible,
    canDeleteEcommerceStore,
    canUpdateEcommerceStore,
    toggleDeleteModal,
    toggleSyncModal,
  } = useBigcommerceStoreDetailsController();

  return (
    <>
      <div className="headerinner ant-row ant-space-align-start ant-row-space-between ">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={goToStoreListPage}>
            <ArrowLeftIcon />
          </div>
          <div className="w-100 ant-row ant-space-vertical">
            <span className="ant-page-header-heading-title">{storeName}</span>
            <span className="ant-page-header-heading-sub-title m-t-4">
              Manage the BigCommerce stores
            </span>
          </div>
        </div>
      </div>
      <div className="m-t-48">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={t('common.labels.overview')} key="1">
            <Overview
              t={t}
              isSyncFailed={isSyncFailed}
              storeDetails={storeDetails}
              timeZone={user?.user?.timezone}
              userName={userName}
              lastSynced={lastSynced}
              storeStatistics={getStoreStatistics}
              canDeleteBigcommerceStore={canDeleteEcommerceStore}
              canUpdateBigcommerceStore={canUpdateEcommerceStore}
              deleteBigcommerceStore={deleteBigcommerceStore}
              isSyncButtonDisabled={isSyncButtonDisabled}
              onReSyncStore={onReSyncStore}
              showDeleteModal={() => toggleDeleteModal(true)}
              showSyncModal={() => toggleSyncModal(true)}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={t('common.labels.logs')} key="2">
            {/*{allLogs?.length !== 0 && (*/}
            <SyncLogs
              t={t}
              storeSyncLogs={allLogs}
              isStoreSyncLogsFetching={storeSyncLogs.isFetching}
              refreshStoreSyncLog={refreshStoreSyncLog}
            />
            {/*)}*/}
          </Tabs.TabPane>
        </Tabs>
      </div>
      <Modal
        className="confirm-modal"
        title={t('common.labels.sync_store')}
        open={isSyncModalVisible}
        onCancel={() => toggleSyncModal(false)}
        onOk={onReSyncStore}
        okText={t('common.labels.sync')}
        centered>
        <p>{t('common.messages.sync_store')}</p>
      </Modal>
      <Modal
        className="confirm-modal"
        title={t('common.labels.remove_store')}
        open={isDeleteModalVisible}
        onCancel={() => toggleDeleteModal(false)}
        onOk={removeBigcommerceStore}
        okButtonProps={{ style: { background: 'red', border: 'red' } }}
        okText={t('common.labels.remove')}
        confirmLoading={deleteBigcommerceStore.isLoading}
        centered>
        <p>{t('common.messages.delete_store_message')}</p>
      </Modal>
    </>
  );
};

export default DetailsBigcommerceStore;
