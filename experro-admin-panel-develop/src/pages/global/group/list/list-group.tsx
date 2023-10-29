import React from 'react';
import { Modal, Spin, Table } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import Filter from '../../../../components/filter';
import useListGroupController from './list-group-controller';
import NoDataFound from '../../../../components/no-data-found';
import NoRecordIcon from '../../../../images/icons/no-records-icon';
import HeaderListGroup from './header-list-group';

const ListGroup: React.FC = () => {
  const {
    t,
    setFilter,
    columns,
    group,
    isModalVisible,
    hideModal,
    onDeleteGroup,
    onAddGroup,
    deleteGroup,
    totalGroupCount,
    groupData,
    isSuccess,
    isListLoading,
    pagination,
  } = useListGroupController();

  return (
    <>
      <HeaderListGroup t={t} onAddGroup={onAddGroup} />
      <>
        <div className={'search-section'}>
          <div className="ant-row ant-space-align-center">
            <Filter className="m-r-16" onChange={setFilter} />
            {isSuccess && (
              <span className="gray-text m-0 search-count">
                {totalGroupCount && totalGroupCount > 1
                  ? t('common.labels.total_records', {
                      entity: totalGroupCount,
                    })
                  : t('common.labels.total_record', {
                      entity: totalGroupCount,
                    })}
              </span>
            )}
          </div>
        </div>
        <div className="table-section">
          {isListLoading ? (
            <Spin
              className="HV-center table-center"
              indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
              size="large"
            />
          ) : (
            <Table
              showSorterTooltip={false}
              columns={columns}
              dataSource={groupData}
              pagination={pagination}
              locale={{
                emptyText: (
                  <NoDataFound
                    icon={<NoRecordIcon />}
                    title={t('common.labels.no_group_added')}
                    description={t('common.labels.add_group_above')}
                  />
                ),
              }}
              rowKey="id"
            />
          )}
        </div>
      </>

      <Modal
        title={t('common.messages.delete_entity', {
          entity: `${group?.name}`,
        })}
        open={isModalVisible}
        onCancel={hideModal}
        onOk={onDeleteGroup}
        okText={t('common.labels.delete')}
        confirmLoading={deleteGroup?.isLoading ? true : false}
        centered
        okButtonProps={{
          style: { background: 'red', border: 'red' },
        }}
        className="confirm-modal">
        <p>{t('common.messages.delete_group_message')}</p>
      </Modal>
    </>
  );
};

export default ListGroup;
