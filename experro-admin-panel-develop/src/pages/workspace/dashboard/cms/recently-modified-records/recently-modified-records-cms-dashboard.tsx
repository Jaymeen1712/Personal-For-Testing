import React from 'react';
import { Spin, Table } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import NoDataFound from '../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';
import { IRecentRecords } from '../../../../../types';
import useRecentlyModifiedRecordsCmsDashboardController from './recently-modified-records-cms-dashboard-controller';

const RecentlyModifiedRecordsCmsDashboard: React.FC<IRecentRecords> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
}) => {
  const { recentlyModifiedRecordsColumns, recentlyModifiedRecordsDashboard } =
    useRecentlyModifiedRecordsCmsDashboardController({
      t,
      workspaceId,
      environment,
      startDate,
      endDate,
    });

  return (
    <div className="border-box">
      <h3 className="dashboard-title m-b-24">
        {t('common.labels.recently_modified_records')}
      </h3>
      <div className="table-section tableCellPadding-9">
        {recentlyModifiedRecordsDashboard.isSuccess &&
        recentlyModifiedRecordsDashboard.data ? (
          <Table
            columns={recentlyModifiedRecordsColumns}
            dataSource={recentlyModifiedRecordsDashboard.data}
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
            {!recentlyModifiedRecordsDashboard.isFetching &&
            !recentlyModifiedRecordsDashboard.isLoading ? (
              <Table
                columns={recentlyModifiedRecordsColumns}
                dataSource={recentlyModifiedRecordsDashboard.data}
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

export default RecentlyModifiedRecordsCmsDashboard;
