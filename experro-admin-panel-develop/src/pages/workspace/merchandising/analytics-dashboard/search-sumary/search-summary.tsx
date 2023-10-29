import React from 'react';
import { TFunction } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import { Col, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import SearchsummaryIcon from '../../../../../images/icons/search-summary';

interface ISearchSummary {
  t: TFunction<'translation', undefined>;
  searchSummaryAnalytics: UseQueryResult<
    | {
        totalSearchesOfSelectedDuration: number[];
        datesOfSelectedDuration: string[];
      }
    | undefined,
    unknown
  >;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchSummary: any;
}

const SearchSummary: React.FC<ISearchSummary> = ({
  t,
  searchSummaryAnalytics,
  searchSummary,
}) => {
  return (
    <Col span={24} className="m-b-32">
      <div className="border-box">
        <h2 className="dashboard-title m-b-24">
          {t('common.labels.search_summary')}
        </h2>
        {searchSummaryAnalytics.isSuccess &&
        searchSummaryAnalytics.data &&
        (searchSummaryAnalytics.data?.datesOfSelectedDuration.length > 0 ||
          searchSummaryAnalytics.data?.totalSearchesOfSelectedDuration.length >
            0) ? (
          <div className="chart-height">
            <HighchartsReact highcharts={Highcharts} options={searchSummary} />
          </div>
        ) : (
          <>
            {!searchSummaryAnalytics.isFetching &&
            !searchSummaryAnalytics.isLoading ? (
              <div className="chart-height no-data-found-dashboard">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={searchSummary}
                />
                <div className="no-data-found-text-dashboard">
                  <SearchsummaryIcon />
                </div>
                <p className="no-data-fount-text">
                  {t('common.labels.no_results_found')}
                </p>
              </div>
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
    </Col>
  );
};

export default SearchSummary;
