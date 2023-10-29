import React from 'react';
import { TFunction } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import { Spin, Table, Col } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import NoDataFound from '../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';

interface ITopZeroSearchResultsRecordsAnalytics {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  topZeroSearchRecordsAnalytics: UseQueryResult<any, unknown>;
  topTenZeroResultSearch: {
    title: string;
    dataIndex: string;
    width: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render?: any;
  }[];
}

const TopZeroSearchResultsRecordsAnalytics: React.FC<
  ITopZeroSearchResultsRecordsAnalytics
> = ({ t, topZeroSearchRecordsAnalytics, topTenZeroResultSearch }) => {
  return (
    <Col span={12} className="">
      <div className="border-box">
        <h3 className="dashboard-title m-b-24">
          {t('common.labels.top_ten_zero_result_search')}
        </h3>

        <div className="table-section">
          {topZeroSearchRecordsAnalytics.isSuccess &&
          topZeroSearchRecordsAnalytics.data ? (
            <Table
              columns={topTenZeroResultSearch}
              dataSource={topZeroSearchRecordsAnalytics.data}
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
              {!topZeroSearchRecordsAnalytics.isFetching &&
              !topZeroSearchRecordsAnalytics.isLoading ? (
                <Table
                  columns={topTenZeroResultSearch}
                  dataSource={topZeroSearchRecordsAnalytics.data}
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
    </Col>
  );
};

export default TopZeroSearchResultsRecordsAnalytics;
