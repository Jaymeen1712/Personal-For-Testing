import React from 'react';
import { Button, Modal, Spin, Table, Tooltip } from 'antd';

import useListBigcommerceStoreController from './list-bigcommerce-store-controller';
import NoRecordIcon from '../../../../../../../../images/icons/no-records-icon';
import NoDataFound from '../../../../../../../../components/no-data-found';
import { LoadingOutlined } from '@ant-design/icons';

const ListBigcommerceStore: React.FC = () => {
  const {
    t,
    onAddStore,
    canCreateEcommerceStore,
    columns,
    listStore,
    listEnvironment,
    addedEnvironmentsOfStores,
    canReadEcommerceStore,
    isDeleteModalVisible,
    toggleRemoveStoreModal,
    removeBigcommerceStore,
    deleteBigcommerceStore,
  } = useListBigcommerceStoreController();

  return (
    <>
      <div className="ant-row ant-row-space-between m-t-32 m-b-40">
        {canCreateEcommerceStore() && (
          <>
            <div className="app-connect-title">
              <h4 className="title-default m-b-8">
                {t('common.labels.connected_store')}
              </h4>
              <p className="gray-text m-0">
                {t('common.labels.manage_store_subtitle', {
                  entity: 'BigCommerce',
                })}
              </p>
            </div>
            <div>
              <Tooltip
                placement="topRight"
                overlayClassName="custom-tooltip custom-large"
                title={
                  listEnvironment.data?.length ===
                    addedEnvironmentsOfStores.length &&
                  'Stores are connected in all environment.'
                }>
                <Button
                  type="primary"
                  onClick={onAddStore}
                  disabled={
                    listEnvironment.data?.length ===
                    addedEnvironmentsOfStores.length
                  }>
                  {t('common.labels.add_store')}
                </Button>
              </Tooltip>
            </div>
          </>
        )}
      </div>

      {listStore.isSuccess && canReadEcommerceStore() ? (
        <>
          {listStore?.data?.length ? (
            <div className="table-section">
              <Table
                pagination={false}
                columns={columns}
                dataSource={listStore.data}
                locale={{
                  emptyText: (
                    <NoDataFound
                      icon={<NoRecordIcon />}
                      title={t('common.labels.no_record_added')}
                      description={t('common.labels.add_user_above')}
                    />
                  ),
                }}
                rowKey="id"
              />
            </div>
          ) : (
            <NoDataFound
              icon={<NoRecordIcon />}
              title={t('common.labels.no_store_added')}
              description={'Add BigCommerce stores to Experro'}
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
        title={t('common.labels.remove_store')}
        open={isDeleteModalVisible}
        onCancel={() => toggleRemoveStoreModal(false)}
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

export default ListBigcommerceStore;
