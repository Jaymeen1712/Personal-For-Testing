import React from 'react';
import { TFunction } from 'react-i18next';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import usePurchaseByCategoryController from './purchase-by-category-controller';
import PurchaseByCategoryIcon from '../../../../../images/icons/purchase-by-categor';

interface IPurchaseByCategory {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const PurchaseByCategory: React.FC<IPurchaseByCategory> = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
}) => {
  const { purchaseByCategories, purchaseByCategory } =
    usePurchaseByCategoryController({
      workspaceId,
      environment,
      startDate,
      endDate,
    });

  return (
    <>
      <h2 className="dashboard-title">
        {t('common.labels.purchase_by_category')}
      </h2>
      {purchaseByCategory.isSuccess &&
      purchaseByCategory.data &&
      (purchaseByCategory.data?.categories.length > 0 ||
        purchaseByCategory.data?.quantity.length > 0) ? (
        <div className="chart-height">
          <HighchartsReact
            highcharts={Highcharts}
            options={purchaseByCategories}
          />
        </div>
      ) : (
        <>
          {!purchaseByCategory.isFetching && !purchaseByCategory.isLoading ? (
            <div className="chart-height no-data-found-dashboard">
              <HighchartsReact
                highcharts={Highcharts}
                options={purchaseByCategories}
              />
              <div className="no-data-found-text-dashboard">
                <PurchaseByCategoryIcon />
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

export default PurchaseByCategory;
