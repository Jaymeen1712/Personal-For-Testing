import React from 'react';
import { TFunction } from 'react-i18next';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { PieChartData } from '../../../../../types';

interface ITopOs {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pieChartDashboardTopCategories: any;
  topOsOptions: PieChartData;
}

const TopOs: React.FC<ITopOs> = ({
  t,
  pieChartDashboardTopCategories,
  topOsOptions,
}) => {
  return (
    <div className="border-box">
      <h2 className="dashboard-title m-b-24">{t('common.labels.top_os')}</h2>
      {pieChartDashboardTopCategories.isSuccess &&
      pieChartDashboardTopCategories.data &&
      pieChartDashboardTopCategories.data[0]['os_name'] ? (
        <HighchartsReact highcharts={Highcharts} options={topOsOptions} />
      ) : (
        <>
          {!pieChartDashboardTopCategories.isFetching &&
          !pieChartDashboardTopCategories.isLoading ? (
            <HighchartsReact highcharts={Highcharts} options={topOsOptions} />
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

export default TopOs;
