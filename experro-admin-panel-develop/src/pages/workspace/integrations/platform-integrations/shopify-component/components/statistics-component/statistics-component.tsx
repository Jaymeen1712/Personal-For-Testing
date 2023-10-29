import React from 'react';

import ArrowLeftIcon from '../../../../../../../images/icons/arrow-left-icon';
import useStatisticsComponentController from './statistics-component-controller';
import { Modal, Tabs } from 'antd';
import { Overview, SyncLogs } from '../components';

const StatisticsComponent = () => {
  const {
    onBackButtonClick,
    t,
    onDeleteStoreButtonClick,
    getStoreDetail,
    getStoreStatistics,
    userName,
    onReSyncStore,
    isSyncButtonDisabled,
    isDeleteModalVisible,
    isDeleteStoreIsLoading,
    onConfirmDeleteStoreButtonClick,
    hideDeleteModal,
    lastSyncAt,
    isSyncModalVisible,
    toggleSyncModal,
    refreshStoreSyncLog,
    allLogs,
    storeSyncLogs,
    canUpdateEcommerceStore,
    canDeleteEcommerceStore,
  } = useStatisticsComponentController();
  return (
    <>
      {/* <div className="headerinner ant-row ant-space-align-start ant-row-space-between m-b-32">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon ant-row" onClick={onBackButtonClick}>
            <ArrowLeftIcon />
          </div>
          <div className="w-100">
            <span className="ant-page-header-heading-title">Shopify</span>
          </div>
        </div>
        <div className="headerright">
          <div className="ant-row ant-row-end ant-space-align-center">
            <Button key="headerAddRecord" onClick={onDeleteStoreButtonClick}>
              {t('common.labels.remove_store')}
            </Button>
            <Button
              id={t('common.labels.save')}
              type="primary"
              onClick={onReSyncStore}
              loading={
                getStoreStatistics.isSuccess &&
                (getStoreStatistics.data?.syncStatus?.status ===
                  'In Progress' ||
                  getStoreStatistics.data?.syncStatus?.status === 'Initiating')
              }
              disabled={getStoreStatistics.isError || isSyncButtonDisabled}>
              {t('common.labels.sync_now')}
            </Button>
          </div>
        </div>
      </div> */}
      <div className="headerinner ant-row ant-space-align-start ant-row-space-between ">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={onBackButtonClick}>
            <ArrowLeftIcon />
          </div>
          <div className="w-100 ant-row ant-space-vertical">
            <span className="ant-page-header-heading-title">
              {getStoreDetail.data?.name}
            </span>
            <span className="ant-page-header-heading-sub-title m-t-4">
              Manage the Shopify stores
            </span>
          </div>
        </div>
      </div>
      <div className="m-t-48">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={t('common.labels.overview')} key="1">
            <Overview
              storeDetails={getStoreDetail}
              t={t}
              storeStatistics={getStoreStatistics}
              userName={userName}
              lastSyncAt={lastSyncAt}
              onDeleteStoreButtonClick={onDeleteStoreButtonClick}
              isSyncButtonDisabled={isSyncButtonDisabled}
              onSyncButtonClick={toggleSyncModal}
              canUpdateEcommerceStore={canUpdateEcommerceStore}
              canDeleteEcommerceStore={canDeleteEcommerceStore}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={t('common.labels.logs')} key="2">
            {/*{allLogs?.length !== 0 && (*/}
            <SyncLogs
              t={t}
              storeSyncLogs={allLogs}
              refreshStoreSyncLog={refreshStoreSyncLog}
              isStoreSyncLogsFetching={storeSyncLogs.isFetching}
            />
            {/*)}*/}
          </Tabs.TabPane>
        </Tabs>
      </div>
      <Modal
        title={t('common.labels.sync_store')}
        open={isSyncModalVisible}
        className="confirm-modal"
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
        onCancel={hideDeleteModal}
        onOk={onConfirmDeleteStoreButtonClick}
        okButtonProps={{ style: { background: 'red', border: 'red' } }}
        okText={t('common.labels.remove')}
        confirmLoading={isDeleteStoreIsLoading}
        centered>
        <p>{t('common.messages.delete_store_message')}</p>
      </Modal>
    </>
  );
};
export default StatisticsComponent;
