import React from 'react';
import { TFunction } from 'react-i18next';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import useTopCustomersRevenueController from './top-customers-revenue-controller';
import CustomerRevenueIcon from '../../../../../images/icons/customer-revenue';

interface ITopCustomersByRevenue {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const TopCustomersByRevenue: React.FC<ITopCustomersByRevenue> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
}) => {
  const { topCustomerByRevenue, topCustomerByRevenueData } =
    useTopCustomersRevenueController({
      workspaceId,
      environment,
      startDate,
      endDate,
    });

  return (
    <>
      <h3 className="dashboard-title">
        {t('common.labels.get_customer_by_revenue')}
      </h3>

      {topCustomerByRevenue.isSuccess &&
      topCustomerByRevenue.data &&
      (topCustomerByRevenue.data?.revenue.length > 0 ||
        topCustomerByRevenue.data?.userId.length > 0) ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={topCustomerByRevenueData}
        />
      ) : (
        <>
          {!topCustomerByRevenue.isFetching &&
          !topCustomerByRevenue.isLoading ? (
            <div className="no-data-found-dashboard">
              <HighchartsReact
                highcharts={Highcharts}
                options={topCustomerByRevenueData}
              />
              <div className="no-data-found-text-dashboard">
                <CustomerRevenueIcon />
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
    </>
  );
};

export default TopCustomersByRevenue;
