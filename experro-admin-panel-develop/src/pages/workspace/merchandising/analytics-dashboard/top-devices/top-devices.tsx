import React from 'react';
import { TFunction } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import { Col, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import TopdevicemerchandingIcon from '../../../../../images/icons/top-device-merchandising';

interface ITopDevices {
  t: TFunction<'translation', undefined>;
  topDevices: UseQueryResult<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { dateDurations: string[]; deviceData: any[] } | undefined,
    unknown
  >;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  topDevicesAnalytics: any;
}

const TopDevices: React.FC<ITopDevices> = ({
  t,
  topDevices,
  topDevicesAnalytics,
}) => {
  return (
    <Col span={12} className="">
      <div className="border-box">
        <h3 className="dashboard-title m-b-24">
          {t('common.labels.top_devices')}
        </h3>

        {topDevices.isSuccess &&
        topDevices.data &&
        (topDevices.data?.deviceData.length > 0 ||
          topDevices.data?.dateDurations.length > 0) ? (
          <HighchartsReact
            highcharts={Highcharts}
            options={topDevicesAnalytics}
          />
        ) : (
          <>
            {!topDevices.isFetching && !topDevices.isLoading ? (
              <div className="no-data-found-dashboard">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={topDevicesAnalytics}
                />
                <div className="no-data-found-text-dashboard">
                  <TopdevicemerchandingIcon />
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
    </Col>
  );
};

export default TopDevices;
