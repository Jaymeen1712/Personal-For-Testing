import React from 'react';
import { TFunction } from 'react-i18next';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import useUnitSoldByDeviceController from './unit-sold-by-device-controller';

interface IUnitSoldByDevices {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const UnitSoldByDevices: React.FC<IUnitSoldByDevices> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
}) => {
  const { unitSoldByDeviceData, unitSoldByDevices } =
    useUnitSoldByDeviceController({
      workspaceId,
      environment,
      startDate,
      endDate,
    });

  return (
    <>
      <h3 className="dashboard-title">
        {t('common.labels.unit_sold_by_devices')}
      </h3>
      {unitSoldByDevices.isSuccess && unitSoldByDevices.data ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={unitSoldByDeviceData}
        />
      ) : (
        <>
          {!unitSoldByDevices.isFetching && !unitSoldByDevices.isLoading ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={unitSoldByDeviceData}
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
    </>
  );
};

export default UnitSoldByDevices;
