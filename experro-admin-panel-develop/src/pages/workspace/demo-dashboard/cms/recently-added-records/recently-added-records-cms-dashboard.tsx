import React from 'react';
import { Spin, Table } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import NoDataFound from '../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';
import { IRecentRecords } from '../../../../../types';
import useRecentlyAddedRecordsCmsDashboardController from './recently-added-records-cms-dashboard-controller';

const RecentlyAddedRecordsCmsDashboard: React.FC<IRecentRecords> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
}) => {
  const { recentlyAddedRecordsColumns, recentlyAddedRecordsDashboard } =
    useRecentlyAddedRecordsCmsDashboardController({
      t,
      workspaceId,
      environment,
      startDate,
      endDate,
    });

  return (
    <div className="border-box">
      <h3 className="dashboard-title m-b-24">
        {t('common.labels.recently_added_records')}
      </h3>
      <div className="table-section tableCellPadding-9">
        {recentlyAddedRecordsDashboard.isSuccess &&
        recentlyAddedRecordsDashboard.data ? (
          <Table
            columns={recentlyAddedRecordsColumns}
            dataSource={recentlyAddedRecordsDashboard.data}
            pagination={false}
            locale={{
              emptyText: (
                <NoDataFound
                  icon={<NoRecordIcon />}
                  title={t('common.labels.no_results_found')}
                />
              ),
            }}
          />
        ) : (
          <>
            {!recentlyAddedRecordsDashboard.isFetching &&
            !recentlyAddedRecordsDashboard.isLoading ? (
              <Table
                columns={recentlyAddedRecordsColumns}
                dataSource={recentlyAddedRecordsDashboard.data}
                pagination={false}
                locale={{
                  emptyText: (
                    <NoDataFound
                      icon={<NoRecordIcon />}
                      title={t('common.labels.no_results_found')}
                    />
                  ),
                }}
              />
            ) : (
              <Spin
                className="HV-center min-height-chart"
                indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
                size="large"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecentlyAddedRecordsCmsDashboard;
