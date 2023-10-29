import React from 'react';
import { Button, Modal, Select, Spin, Table } from 'antd';

import NoDataFound from '../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';
import useListHistoryController from './list-history-controller';
import { PAGE_SIZE } from '../../../../../utills';
import { LoadingOutlined } from '@ant-design/icons';
import { UseQueryResult } from 'react-query';
import { IAPIError, IListEnvironments } from '../../../../../types';
import DownArrowIcon from '../../../../../images/icons/downarrow-icon';

interface ListHistoryProps {
  listEnvironments: UseQueryResult<IListEnvironments[], IAPIError>;
  isPublishButtonDisabled: boolean;
  setIsPublishButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isThemePublished: boolean;
  setIsThemePublished: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListHistory: React.FC<ListHistoryProps> = ({
  listEnvironments,
  isPublishButtonDisabled,
  setIsPublishButtonDisabled,
}) => {
  const {
    t,
    columns,
    listHistory,
    isPublishEnvironmentModalVisible,
    onHideSelectEnvironment,
    selectedPublishThemeEnvironment,
    onSelectEnvironmentToPublish,
    isPublishButtonVisible,
    onEnvironmentToPublish,
    skip,
    skipLimit,
    onPageChange,
    themePublishedEnvironmentId,
    // onChangeTable,
    // sortFlag,
    themeHistoryData,
    totalRecordsCount,
  } = useListHistoryController(
    listEnvironments,
    isPublishButtonDisabled,
    setIsPublishButtonDisabled
  );

  return (
    <div>
      <div className="table-section">
        {listHistory.isSuccess ? (
          // || sortFlag
          <Table
            // @ts-ignore
            className="tableCellPadding-11"
            columns={columns}
            dataSource={themeHistoryData}
            // showSorterTooltip={false}
            // onChange={onChangeTable}
            // loading={listHistory.isLoading}
            locale={{
              emptyText: (
                <NoDataFound
                  icon={<NoRecordIcon />}
                  title={t('common.labels.no_record_added')}
                />
              ),
            }}
            pagination={{
              locale: { items_per_page: ' per page' },
              current: skip,
              pageSize: skipLimit,
              total: totalRecordsCount,
              onChange: onPageChange,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 50, 100],
              hideOnSinglePage: !!(totalRecordsCount < PAGE_SIZE),
            }}
          />
        ) : (
          <Spin
            className="HV-center table-center"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
        )}
      </div>

      <Modal
        centered
        className="CustomModal CustomModal-small"
        open={isPublishEnvironmentModalVisible}
        title={t('common.labels.select_environment_to_publish')}
        onCancel={onHideSelectEnvironment}
        footer={[
          <Button key="back" onClick={onHideSelectEnvironment}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={onEnvironmentToPublish}
            disabled={isPublishButtonVisible}>
            {t('common.labels.publish')}
          </Button>,
        ]}>
        <>
          <span className="text-dark-gray">
            {t('common.labels.environment')}
          </span>
          <Select
            className="w-100 m-t-8"
            placeholder="Select Environment"
            value={selectedPublishThemeEnvironment}
            suffixIcon={<DownArrowIcon />}
            onChange={onSelectEnvironmentToPublish}>
            {listEnvironments.isSuccess &&
              listEnvironments.data &&
              listEnvironments.data.length > 0 &&
              listEnvironments.data.map((environment) => {
                if (environment.id !== themePublishedEnvironmentId) {
                  return (
                    <Select.Option value={environment.id}>
                      {environment.title}
                    </Select.Option>
                  );
                }
                return null;
              })}
          </Select>
        </>
      </Modal>
    </div>
  );
};

export default ListHistory;
