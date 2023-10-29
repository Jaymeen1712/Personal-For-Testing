import React from 'react';
import { Button, Tabs } from 'antd';

import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../../utills';
import { Overview, SyncLogs } from '../components';
import useBigcommerceStoreDetailsController from './bigcommerce-store-details-controller';
import Modal from '../../../../components/modal';
import ArrowLeftIcon from '../../../../images/icons/arrow-left-icon';
import SubSideBar from '../../../../components/sub-sidebar';
import HamburgerIcon from '../../../../images/icons/hamburger-icon';

interface IDetailsBigcommerceStore {
  onMainSidebarActiveItem?: (val: string) => void;
}

const DetailsBigcommerceStore: React.FC<IDetailsBigcommerceStore> = ({
  onMainSidebarActiveItem,
}) => {
  const {
    t,
    storeName,
    storeDetails,
    user,
    userName,
    lastSynced,
    removeBigcommerceStore,
    deleteBigcommerceStore,
    getStoreStatistics,
    onReSyncStore,
    changeTab,
    activeTabKey,
    refreshStoreSyncLog,
    allLogs,
    isDeleteModalVisible,
    hideDeleteModal,
    showModal,
    storeSyncLogs,
    goToStoreListPage,
    permissions,
    isSyncButtonDisabled,
  } = useBigcommerceStoreDetailsController({ onMainSidebarActiveItem });

  return (
    <>
      <SubSideBar
        isGlobalPage={false}
        showSubmenuIcon={false}
        sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.SETTINGS}
        subSidebarActiveItemKey={
          SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.ECOMMERCE_PLUGINS.BIGCOMMERCE
        }>
        <div className="headerinner ant-row ant-space-align-start ant-row-space-between ">
          <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
            <div className="hamburgericon">
              <HamburgerIcon />
            </div>
            <div className="w-100 ant-row ant-space-vertical">
              <span className="ant-page-header-heading-title">
                {
                  <>
                    <Button
                      type="link"
                      className="OnlyIcon m-r-16 arrowleft-icon"
                      icon={<ArrowLeftIcon />}
                      onClick={goToStoreListPage}
                    />
                    {storeName}
                  </>
                }
              </span>
            </div>
          </div>
          <div className="headerright">
            {activeTabKey === '1' ? (
              <div className="ant-row ant-row-end">
                {permissions.canDeleteEcommerceStore() && (
                  <Button
                    id={t('common.labels.cancel')}
                    onClick={showModal}
                    loading={deleteBigcommerceStore.isLoading}>
                    {t('common.labels.remove_store')}
                  </Button>
                )}
                <Button
                  id={t('common.labels.save')}
                  type="primary"
                  onClick={onReSyncStore}
                  loading={
                    getStoreStatistics.isSuccess &&
                    (getStoreStatistics.data?.syncStatus?.status ===
                      'In Progress' ||
                      getStoreStatistics.data?.syncStatus?.status ===
                        'Initiating')
                  }
                  disabled={getStoreStatistics.isError || isSyncButtonDisabled}>
                  {t('common.labels.sync_now')}
                </Button>
              </div>
            ) : (
              <div className="ant-row ant-row-end">
                <Button
                  onClick={refreshStoreSyncLog}
                  loading={storeSyncLogs.isFetching}>
                  {t('common.labels.refresh')}
                </Button>
              </div>
            )}
          </div>
        </div>
        <div>
          <Tabs defaultActiveKey="1" onChange={changeTab}>
            <Tabs.TabPane tab={t('common.labels.overview')} key="1">
              <Overview
                t={t}
                storeDetails={storeDetails}
                timeZone={user?.user?.timezone}
                userName={userName}
                lastSynced={lastSynced}
                storeStatistics={getStoreStatistics}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={t('common.labels.logs')} key="2">
              {allLogs?.length !== 0 && (
                <SyncLogs t={t} storeSyncLogs={allLogs} />
              )}
            </Tabs.TabPane>
          </Tabs>
        </div>

        <Modal
          classname="confirm-modal"
          title={t('common.labels.delete_store_title')}
          isModalVisibility={isDeleteModalVisible}
          hideModal={hideDeleteModal}
          onOK={removeBigcommerceStore}
          okText={t('common.labels.delete')}
          confirmLoading={deleteBigcommerceStore.isLoading}>
          <p>{t('common.messages.delete_store_message')}</p>
        </Modal>
      </SubSideBar>
    </>
  );
};

export default DetailsBigcommerceStore;
