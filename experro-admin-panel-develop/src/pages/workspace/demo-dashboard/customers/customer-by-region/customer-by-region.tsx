import React from 'react';
import { TFunction } from 'react-i18next';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import useCustomerByRegionController from './customer-by-region-controller';
import CustomerRegionIcon from '../../../../../images/icons/customer-region';

interface ICustomerByRegion {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const CustomerByRegion: React.FC<ICustomerByRegion> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
}) => {
  const { customerByRegion, customerByRegionData } =
    useCustomerByRegionController({
      workspaceId,
      environment,
      startDate,
      endDate,
    });

  return (
    <div className="border-box">
      <h2 className="dashboard-title">
        {t('common.labels.customer_by_region')}
      </h2>

      {customerByRegion.isSuccess &&
      customerByRegion.data &&
      customerByRegion.data?.moduleWiseData.length > 0 ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={customerByRegionData}
        />
      ) : (
        <>
          {!customerByRegion.isFetching && !customerByRegion.isLoading ? (
            <div className="no-data-found-dashboard">
              <HighchartsReact
                highcharts={Highcharts}
                options={customerByRegionData}
              />
              <div className="no-data-found-text-dashboard">
                <CustomerRegionIcon />
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

export default CustomerByRegion;
