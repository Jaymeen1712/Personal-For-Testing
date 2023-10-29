import React from 'react';
import { TFunction } from 'react-i18next';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import Websitetraffic from '../../../../../images/icons/website-traffic';

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
      <h2 className="dashboard-title m-b-24">
        {t('common.labels.website_traffic')}
      </h2>
      {visitorsDashboard.isSuccess &&
      visitorsDashboard.data &&
      visitorsDashboard.data.datesOfSelectedDuration.length > 0 &&
      visitorsDashboard.data.totalNewUsersOfSelectedDuration.length > 0 &&
      visitorsDashboard.data.totalUsersOfSelectedDuration.length > 0 &&
      (visitorsDashboard.data.totalNewUsersOfSelectedDuration.some(
        (totalNewuser: number) => totalNewuser > 0
      ) ||
        visitorsDashboard.data.totalUsersOfSelectedDuration.some(
          (totalNewuser: number) => totalNewuser > 0
        )) ? (
        <div className="chart-height">
          <HighchartsReact highcharts={Highcharts} options={websiteOptions} />
        </div>
      ) : (
        <>
          {!visitorsDashboard.isFetching && !visitorsDashboard.isLoading ? (
            <div className="chart-height no-data-found-dashboard">
              <HighchartsReact
                highcharts={Highcharts}
                options={websiteOptions}
              />
              <div className="no-data-found-text-dashboard">
                <Websitetraffic />
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

export default WebsiteTraffic;
