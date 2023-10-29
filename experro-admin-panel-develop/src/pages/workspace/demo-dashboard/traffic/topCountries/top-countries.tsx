import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';
import { TFunction } from 'react-i18next';
import { PieChartData } from '../../../../../types';
import TopcountriesIcon from '../../../../../images/icons/top-countires';

interface ITopLocations {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pieChartDashboardTopCategories: any;
  topLocations: PieChartData;
}

const TopCountries: React.FC<ITopLocations> = ({
  t,
  pieChartDashboardTopCategories,
  topLocations,
}) => {
  return (
    <div className="border-box">
      <h2 className="dashboard-title m-b-24">
        {t('common.labels.top_countries')}
      </h2>
      {pieChartDashboardTopCategories.isSuccess &&
      pieChartDashboardTopCategories.data &&
      pieChartDashboardTopCategories.data[0]['country'] &&
      pieChartDashboardTopCategories.data[0]['country'].moduleWiseData.length >
        0 &&
      pieChartDashboardTopCategories.data[0]['country'].totalModuleCount > 0 ? (
        <HighchartsReact highcharts={Highcharts} options={topLocations} />
      ) : (
        <>
          {!pieChartDashboardTopCategories.isFetching &&
          !pieChartDashboardTopCategories.isLoading ? (
            <div className="no-data-found-dashboard">
              <HighchartsReact highcharts={Highcharts} options={topLocations} />
              <div className="no-data-found-text-dashboard">
                <TopcountriesIcon />
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

export default TopCountries;
