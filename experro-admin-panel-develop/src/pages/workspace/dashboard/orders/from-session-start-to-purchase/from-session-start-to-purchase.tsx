import { TFunction } from 'react-i18next';
import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import useFromSessionStartToPurchaseController from './from-session-start-to-purchase-controller';

interface IFromSessionStartToPurchase {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const FromSessionStartToPurchase: React.FC<IFromSessionStartToPurchase> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
}) => {
  const { fromSessionStartToPurchase, fromSessionStartToPurchaseInfo } =
    useFromSessionStartToPurchaseController({
      t,
      workspaceId,
      environment,
      startDate,
      endDate,
    });

  return (
    <>
      <h2 className="dashboard-title">
        {t('common.labels.from_session_start_to_purchase')}
      </h2>
      {fromSessionStartToPurchase.isSuccess &&
      fromSessionStartToPurchase.data ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={fromSessionStartToPurchaseInfo}
        />
      ) : (
        <>
          {!fromSessionStartToPurchase.isFetching &&
          !fromSessionStartToPurchase.isLoading ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={fromSessionStartToPurchaseInfo}
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

export default FromSessionStartToPurchase;
