import { TFunction } from 'react-i18next';
import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import useOrderByLocationController from './order-by-location-controller';

interface IOrderByLocation {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const OrderByLocation: React.FC<IOrderByLocation> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
}) => {
  const { orderByLocationData, orderByLocation } = useOrderByLocationController(
    {
      workspaceId,
      environment,
      startDate,
      endDate,
    }
  );

  return (
    <div className="border-box">
      <h2 className="dashboard-title">
        {t('common.labels.order_by_location')}
      </h2>
      {orderByLocation.isSuccess && orderByLocation.data ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={orderByLocationData}
        />
      ) : (
        <>
          {!orderByLocation.isFetching && !orderByLocation.isLoading ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={orderByLocationData}
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
  );
};

export default OrderByLocation;
