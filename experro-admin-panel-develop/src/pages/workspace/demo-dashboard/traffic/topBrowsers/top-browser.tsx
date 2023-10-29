import React from 'react';
import { TFunction } from 'react-i18next';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { PieChartData } from '../../../../../types';
import TopbrowserIcon from '../../../../../images/icons/top-browser';

interface ITopBrowsers {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pieChartDashboardTopCategories: any;
  topBrowsers: PieChartData;
}

const TopBrowser: React.FC<ITopBrowsers> = ({
  t,
  pieChartDashboardTopCategories,
  topBrowsers,
}) => {
  return (
    <div className="border-box">
      <h2 className="dashboard-title m-b-24">
        {t('common.labels.top_browsers')}
      </h2>
      {pieChartDashboardTopCategories.isSuccess &&
      pieChartDashboardTopCategories.data &&
      pieChartDashboardTopCategories.data[0]['device_name'] &&
      pieChartDashboardTopCategories.data[0]['device_name'].moduleWiseData
        .length > 0 &&
      pieChartDashboardTopCategories.data[0]['device_name'].totalModuleCount >
        0 ? (
        <HighchartsReact highcharts={Highcharts} options={topBrowsers} />
      ) : (
        <>
          {!pieChartDashboardTopCategories.isFetching &&
          !pieChartDashboardTopCategories.isLoading ? (
            <div className="no-data-found-dashboard">
              <HighchartsReact highcharts={Highcharts} options={topBrowsers} />
              <div className="no-data-found-text-dashboard">
                <TopbrowserIcon />
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
  );
};

export default TopBrowser;
