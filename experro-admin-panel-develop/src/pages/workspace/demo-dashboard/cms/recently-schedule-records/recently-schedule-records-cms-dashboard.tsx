import React from 'react';
import { Spin, Table } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import NoDataFound from '../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';
import { IRecentRecords } from '../../../../../types';
import useRecentlyScheduleRecordsCmsDashboardController from './recently-schedule-records-cms-dashboard-controller';

const RecentlyScheduleRecordsCmsDashboard: React.FC<IRecentRecords> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
}) => {
  const { recentlyScheduledRecordDashboard, scheduledRecordsColumns } =
    useRecentlyScheduleRecordsCmsDashboardController({
      t,
      workspaceId,
      environment,
      startDate,
      endDate,
    });

  return (
    <div className="border-box">
      <h3 className="dashboard-title m-b-24">
        {t('common.labels.scheduled_records')}
      </h3>
      <div className="table-section tableCellPadding-9">
        {recentlyScheduledRecordDashboard.isSuccess &&
        recentlyScheduledRecordDashboard.data ? (
          <Table
            columns={scheduledRecordsColumns}
            dataSource={recentlyScheduledRecordDashboard.data}
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
            {!recentlyScheduledRecordDashboard.isFetching &&
            !recentlyScheduledRecordDashboard.isLoading ? (
              <Table
                columns={scheduledRecordsColumns}
                dataSource={recentlyScheduledRecordDashboard.data}
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

export default RecentlyScheduleRecordsCmsDashboard;
