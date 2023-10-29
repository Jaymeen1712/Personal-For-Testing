import React from 'react';
import { TFunction } from 'react-i18next';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

interface IWebsiteTraffic {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visitorsDashboard: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  websiteOptions: any;
}

const WebsiteTraffic: React.FC<IWebsiteTraffic> = ({
  t,
  visitorsDashboard,
  websiteOptions,
}) => {
  return (
    <>
      <h2 className="dashboard-title m-b-24">{t('common.labels.website_traffic')}</h2>
      {visitorsDashboard.isSuccess && visitorsDashboard.data ? (
        <div className="chart-height">
          <HighchartsReact highcharts={Highcharts} options={websiteOptions} />
        </div>
      ) : (
        <>
          {!visitorsDashboard.isFetching && !visitorsDashboard.isLoading ? (
            <div className="chart-height">
              <HighchartsReact
                highcharts={Highcharts}
                options={websiteOptions}
              />
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

export default WebsiteTraffic;
