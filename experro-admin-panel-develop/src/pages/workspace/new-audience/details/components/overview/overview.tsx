import { Spin } from 'antd';
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

import { UserContextProps } from '../../../../../../context/user';
import useOverviewController from './overview-controller';
import AudienceDetails from '../audience-details';
import RecentlyPurchasedProductsOverview from './recently-purchased-products';
import RecentlyViewedProductsOverview from './recently-viewed-products';

interface OverviewTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsAudience: any;
  user: UserContextProps | undefined;
  startDate?: string;
  endDate?: string;
  workspaceId: string;
  environmentId: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  detailsAudience,
  user,
  startDate,
  endDate,
  workspaceId,
  environmentId,
}) => {
  const {
    t,
    recentlyViewedProducts,
    recentlyPurchasedProducts,
    totalViewedOrders,
    totalOrders,
    totalPurchasedAmount,
    domain,
    detailsWorkspacePublishQueue,
    currencyFormat,
  } = useOverviewController(
    detailsAudience,
    workspaceId,
    environmentId,
    startDate,
    endDate
  );

  return (
    <div className="audience">
      {detailsAudience.isFetching || detailsAudience.isLoading ? (
        <Spin
          className="HV-center table-center"
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          size="large"
        />
      ) : (
        <>
          <div className="audienceLeft">
            <AudienceDetails
              detailsAudience={detailsAudience}
              t={t}
              user={user}
            />
          </div>

          <div className="audienceRight">
            <div className="audienceActivities">
              <div className="bigcommerce-store-grid">
                <div>
                  <span>{t('common.labels.total_items_viewed')} </span>
                  {totalViewedOrders.isSuccess && totalViewedOrders.data ? (
                    <p>
                      {totalViewedOrders.data.event_count
                        ? totalViewedOrders.data.event_count
                        : 0}
                    </p>
                  ) : !totalViewedOrders.isFetching ? (
                    <p>{0}</p>
                  ) : (
                    <Spin
                      className="HV-center ant-row-start"
                      indicator={
                        <LoadingOutlined style={{ fontSize: 24 }} spin />
                      }
                      size="large"
                    />
                  )}
                </div>

                <div>
                  <span>{t('common.labels.total_orders')} </span>

                  {totalOrders.isSuccess && totalOrders.data ? (
                    <p>
                      {totalOrders.data.event_count
                        ? totalOrders.data.event_count
                        : 0}
                    </p>
                  ) : !totalOrders.isFetching ? (
                    <p>{0}</p>
                  ) : (
                    <Spin
                      className="HV-center ant-row-start"
                      indicator={
                        <LoadingOutlined style={{ fontSize: 24 }} spin />
                      }
                      size="large"
                    />
                  )}
                </div>

                <div>
                  <span>{t('common.labels.total_purchase_amount')} </span>

                  {totalPurchasedAmount.isSuccess &&
                  detailsWorkspacePublishQueue.data &&
                  totalPurchasedAmount.data ? (
                    <p>
                      <>
                        {currencyFormat({
                          value: totalPurchasedAmount.data.event_sum,
                          thousandSeparator: ',',
                          decimalSeparator: '.',
                          prefixSymbol: '$',
                        })}
                      </>
                    </p>
                  ) : !totalPurchasedAmount.isFetching ? (
                    0
                  ) : (
                    <Spin
                      className="HV-center ant-row-start"
                      indicator={
                        <LoadingOutlined style={{ fontSize: 24 }} spin />
                      }
                      size="large"
                    />
                  )}
                </div>
              </div>

              <RecentlyPurchasedProductsOverview
                recentlyPurchasedProducts={recentlyPurchasedProducts}
                t={t}
                domain={domain}
                currency={detailsWorkspacePublishQueue.data?.currency}
              />

              <RecentlyViewedProductsOverview
                recentlyViewedProducts={recentlyViewedProducts}
                t={t}
                domain={domain}
                currency={detailsWorkspacePublishQueue.data?.currency}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OverviewTab;
