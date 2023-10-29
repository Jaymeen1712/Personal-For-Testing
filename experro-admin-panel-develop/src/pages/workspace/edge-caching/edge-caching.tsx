import { Table, Spin, Modal, Button } from 'antd';

import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../utills';
import useEdgeCachingController from './edge-caching-controller';
import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';
import SubSideBar from '../../../components/sub-sidebar';
import HeaderEdgeCaching from './header-edge-caching';

interface IEdgeCaching {
  onMainSidebarActiveItem?: (val: string) => void;
}

const EdgeCaching: React.FC<IEdgeCaching> = ({ onMainSidebarActiveItem }) => {
  const {
    t,
    dataSource,
    columns,
    onAllCacheDeleteClick,
    isLoading,
    canDeleteCache,
    onPurgeAllCacheClick,
    onPurgeAllCacheCancel,
    isPurgeAllCacheModalVisible,
  } = useEdgeCachingController({ onMainSidebarActiveItem });

  return (
    <>
      <div className="page-wrapper">
        <SubSideBar
          sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.SETTINGS}
          subSidebarActiveItemKey={
            SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.GENERAL.EDGE_CACHING
          }
          isEnvironmentSelectorVisible={true}
          isEnvironmentSelectorDisable={true}
          environmentSelectDefaultValue={'All'}
          disableEnvironmentToolTipMessage={t(
            'common.messages.environment_is_not_applicable'
          )}>
          <HeaderEdgeCaching
            t={t}
            canDeleteCache={canDeleteCache}
            onPurgeAllCacheClick={onPurgeAllCacheClick}
          />
          {isLoading ? (
            <Spin
              className="HV-center table-center"
              indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
              size="large"
            />
          ) : (
            <>
              <div className="table-section cache-table-section">
                <Table
                  className="tableCellPadding-9"
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                />
              </div>
            </>
          )}
        </SubSideBar>
      </div>
      <Modal
        visible={isPurgeAllCacheModalVisible}
        title={t('common.labels.purge_cache')}
        centered
        onCancel={onPurgeAllCacheCancel}
        footer={[
          <Button key="cancel" onClick={onPurgeAllCacheCancel}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            key="purge_all_cache"
            type="primary"
            onClick={onAllCacheDeleteClick}
            danger>
            {t('common.labels.purge_all_cache')}
          </Button>,
        ]}
        className="confirm-modal CustomModal-small">
        {t('common.messages.clear_all_cache_message')}
      </Modal>
    </>
  );
};
export default EdgeCaching;
