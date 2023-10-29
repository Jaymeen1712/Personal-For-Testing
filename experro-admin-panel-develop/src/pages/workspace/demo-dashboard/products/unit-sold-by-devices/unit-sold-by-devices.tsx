import React from 'react';
import { TFunction } from 'react-i18next';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import useUnitSoldByDeviceController from './unit-sold-by-device-controller';
import UnitsoldIcon from '../../../../../images/icons/unitsold';

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
      {unitSoldByDevices.isSuccess &&
      unitSoldByDevices.data &&
      (unitSoldByDevices.data?.deviceData.length > 0 ||
        unitSoldByDevices.data?.dateDurations.length > 0) ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={unitSoldByDeviceData}
        />
      ) : (
        <>
          {!unitSoldByDevices.isFetching && !unitSoldByDevices.isLoading ? (
            <div className="no-data-found-dashboard">
              <HighchartsReact
                highcharts={Highcharts}
                options={unitSoldByDeviceData}
              />
              <div className="no-data-found-text-dashboard">
                <UnitsoldIcon />
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

export default UnitSoldByDevices;
