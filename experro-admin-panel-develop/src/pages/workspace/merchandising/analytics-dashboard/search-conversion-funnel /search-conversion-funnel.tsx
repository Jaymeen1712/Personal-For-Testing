import React from 'react';
import { TFunction } from 'react-i18next';
import { Col, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import ConversationfunnelIcon from '../../../../../images/icons/conversation-funnel';

interface ISearchConversionFunnel {
  t: TFunction<'translation', undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  topSearchesClicksCartsOrdersAnalytics: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchConversionFunnelData: any;
}

const SearchConversionFunnel: React.FC<ISearchConversionFunnel> = ({
  t,
  topSearchesClicksCartsOrdersAnalytics,
  searchConversionFunnelData,
}) => {
  return (
    <Col span={12} className="">
      <div className="border-box">
        <h3 className="dashboard-title m-b-24">
          {t('common.labels.search_conversion_funnel')}
        </h3>
        {topSearchesClicksCartsOrdersAnalytics.isSuccess &&
        topSearchesClicksCartsOrdersAnalytics.data &&
        topSearchesClicksCartsOrdersAnalytics.data?.selectedModuleData
          // @ts-ignore
          .map((moduleData) => moduleData[1] > 0)
          // @ts-ignore
          .some((filtered) => filtered === true) ? (
          <HighchartsReact
            highcharts={Highcharts}
            options={searchConversionFunnelData}
          />
        ) : (
          <>
            {!topSearchesClicksCartsOrdersAnalytics.isFetching ? (
              <div className="no-data-found-dashboard">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={searchConversionFunnelData}
                />
                <div className="no-data-found-text-dashboard">
                  <ConversationfunnelIcon />
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

export default SearchConversionFunnel;
