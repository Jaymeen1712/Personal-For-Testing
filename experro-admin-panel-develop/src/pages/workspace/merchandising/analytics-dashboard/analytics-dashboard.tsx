import React from 'react';
import Highcharts from 'highcharts';
import highchartsFunnel from 'highcharts/modules/funnel';
import { Row } from 'antd';

import AnalyticsDashboardController from './analytics-dashboard-controller';
import HeaderAnalyticsDashboard from './header-analytics-dashboard';
import TotalSearches from './total-searches';
import AverageSearchesPerDay from './average-searches-per-day';
import ZeroResultSearches from './zero-result-searches';
import SearchSummary from './search-sumary';
import SearchConversionFunnel from './search-conversion-funnel ';
import TopZeroSearchResultsRecordsAnalytics from './top-zero-search-records-analytics';
import TopDevices from './top-devices';
import TopTenSearches from './top-ten-searches';

highchartsFunnel(Highcharts);

interface IAnalyticsDashboardRequest {
  environment: string | null;
}

const AnalyticsDashboard: React.FC<IAnalyticsDashboardRequest> = ({
  environment,
}) => {
  const {
    totalSearch,
    totalPreviousSearch,
    totalZeroResultSearches,
    totalZeroResultPreviousSearches,
    searchSummaryAnalytics,
    searchSummary,
    topSearchesClicksCartsOrdersAnalytics,
    searchConversionFunnelData,
    topZeroSearchRecordsAnalytics,
    topTenZeroResultSearch,
    topSearchedRecordsAnalytics,
    topTenSearchResultSearch,
    topDevicesAnalytics,
    topDevices,
    t,
    onStartDateEndDateChange,
    startDate,
    endDate,
    daysDifference,
  } = AnalyticsDashboardController({
    environment,
  });

  return (
    <>
      <HeaderAnalyticsDashboard
        t={t}
        startDate={startDate}
        endDate={endDate}
        onStartDateEndDateChange={onStartDateEndDateChange}
      />

      <div className="dashboard-page merchandising-dashboard-page">
        <Row gutter={32} className="m-b-32  dashboard-counter-list">
          <TotalSearches
            t={t}
            totalSearch={totalSearch}
            totalPreviousSearch={totalPreviousSearch}
          />

          <AverageSearchesPerDay
            t={t}
            totalSearch={totalSearch}
            totalPreviousSearch={totalPreviousSearch}
            daysDifference={daysDifference}
          />

          <ZeroResultSearches
            t={t}
            totalZeroResultSearches={totalZeroResultSearches}
            totalZeroResultPreviousSearches={totalZeroResultPreviousSearches}
          />
        </Row>
        <Row gutter={24}>
          <SearchSummary
            t={t}
            searchSummary={searchSummary}
            searchSummaryAnalytics={searchSummaryAnalytics}
          />
        </Row>

        <Row gutter={32} className="m-b-32 dashboard-table">
          <SearchConversionFunnel
            t={t}
            topSearchesClicksCartsOrdersAnalytics={
              topSearchesClicksCartsOrdersAnalytics
            }
            searchConversionFunnelData={searchConversionFunnelData}
          />

          <TopZeroSearchResultsRecordsAnalytics
            t={t}
            topZeroSearchRecordsAnalytics={topZeroSearchRecordsAnalytics}
            topTenZeroResultSearch={topTenZeroResultSearch}
          />
        </Row>

        <Row gutter={32} className="m-b-32 dashboard-table">
          <TopDevices
            t={t}
            topDevices={topDevices}
            topDevicesAnalytics={topDevicesAnalytics}
          />

          <TopTenSearches
            t={t}
            topSearchedRecordsAnalytics={topSearchedRecordsAnalytics}
            topTenSearchResultSearch={topTenSearchResultSearch}
          />
        </Row>
      </div>
    </>
  );
};

export default AnalyticsDashboard;
