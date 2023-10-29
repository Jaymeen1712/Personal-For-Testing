import React from 'react';
import { Spin, Table } from 'antd';
import { TFunction } from 'react-i18next';
import { LoadingOutlined } from '@ant-design/icons';

import NoDataFound from '../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';
import useSessionByTrafficSourcesController from './session-by-traffic-sources-controller';

interface ISessionByTrafficSources {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
  pastStartDate?: string;
  pastEndDate?: string;
}

const SessionByTrafficSources: React.FC<ISessionByTrafficSources> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
  pastStartDate,
  pastEndDate,
}) => {
  const {
    sessionByTrafficSource,
    sessionByTrafficSourcePreviousDuration,
    columns,
    sessionByTrafficSourcesData,
  } = useSessionByTrafficSourcesController({
    workspaceId,
    environment,
    startDate,
    endDate,
    pastStartDate,
    pastEndDate,
    t,
  });

  return (
    <div className="border-box">
      <h3 className="dashboard-title">
        {t('common.labels.session_by_traffic_sources')}
      </h3>
      {sessionByTrafficSource.data &&
      sessionByTrafficSource.isSuccess &&
      sessionByTrafficSourcePreviousDuration.data &&
      sessionByTrafficSourcePreviousDuration.isSuccess ? (
        <div className="table-section">
          <Table
            columns={columns}
            dataSource={sessionByTrafficSourcesData}
            locale={{
              emptyText: (
                <NoDataFound
                  icon={<NoRecordIcon />}
                  title={t('common.labels.no_record_found')}
                />
              ),
            }}
            pagination={false}
          />
        </div>
      ) : (
        (sessionByTrafficSource.isLoading ||
          sessionByTrafficSource.isFetching ||
          sessionByTrafficSourcePreviousDuration.isLoading ||
          sessionByTrafficSourcePreviousDuration.isFetching) && (
          <Spin
            className="HV-center table-center"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
        )
      )}
    </div>
  );
};

export default SessionByTrafficSources;
