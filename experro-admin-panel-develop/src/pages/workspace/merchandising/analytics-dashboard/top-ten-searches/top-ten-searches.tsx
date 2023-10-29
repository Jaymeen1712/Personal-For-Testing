import React from 'react';
import { TFunction } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import { Spin, Table, Col } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import NoDataFound from '../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';

interface ITopTenSearches {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  topSearchedRecordsAnalytics: UseQueryResult<any, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  topTenSearchResultSearch: any;
}

const TopTenSearches: React.FC<ITopTenSearches> = ({
  t,
  topSearchedRecordsAnalytics,
  topTenSearchResultSearch,
}) => {
  return (
    <Col span={12} className="">
      <div className="border-box">
        <h3 className="dashboard-title m-b-24">
          {t('common.labels.top_ten_searches')}
        </h3>
        <div className="table-section">
          {topSearchedRecordsAnalytics.isSuccess &&
          topSearchedRecordsAnalytics.data ? (
            <Table
              columns={topTenSearchResultSearch}
              dataSource={topSearchedRecordsAnalytics.data}
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
              {!topSearchedRecordsAnalytics.isFetching &&
              !topSearchedRecordsAnalytics.isLoading ? (
                <Table
                  columns={topTenSearchResultSearch}
                  dataSource={topSearchedRecordsAnalytics.data}
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

export default TopTenSearches;
