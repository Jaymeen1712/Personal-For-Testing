import { TFunction } from 'react-i18next';
import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import usePurchaseByDeviceController from './purchase-by-device-controller';
import PurchaseBydeviceIcon from '../../../../../images/icons/purchase-by-device';

interface IPurchaseByDevice {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const PurchaseByDevice: React.FC<IPurchaseByDevice> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
}) => {
  const { purchaseByDeviceData, purchasedByDevice } =
    usePurchaseByDeviceController({
      workspaceId,
      environment,
      startDate,
      endDate,
    });

  return (
    <div className="border-box">
      <h2 className="dashboard-title">
        {t('common.labels.purchase_by_device')}
      </h2>
      {purchaseByDeviceData.isSuccess &&
      purchaseByDeviceData.data &&
      purchaseByDeviceData.data?.moduleWiseData.length > 0 ? (
        <HighchartsReact highcharts={Highcharts} options={purchasedByDevice} />
      ) : (
        <>
          {!purchaseByDeviceData.isFetching &&
          !purchaseByDeviceData.isLoading ? (
            <div className="no-data-found-dashboard">
              <HighchartsReact
                highcharts={Highcharts}
                options={purchasedByDevice}
              />
              <div className="no-data-found-text-dashboard">
                <PurchaseBydeviceIcon />
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

export default PurchaseByDevice;
