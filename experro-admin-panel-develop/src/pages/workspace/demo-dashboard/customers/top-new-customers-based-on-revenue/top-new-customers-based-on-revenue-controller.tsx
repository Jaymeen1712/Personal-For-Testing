import React, { useMemo } from 'react';
import { TFunction } from 'react-i18next';

import {
  useTopNewCustomersBasedOnRevenue,
  useWorkspaceDetailsDashboard,
} from '../../services';
import { currencyFormatter } from '../../../../../utills';

interface ITopNewCustomersBasedOnRevenueResponse {
  categoryViewed: number;
  checkoutInitiated: number;
  ordersPlaced: number;
  pageViewed: number;
  productAddedToCart: number;
  productSearched: number;
  productViewed: number;
  totalRevenue: number;
  userId: string;
}

interface IUseTopNewCustomersBasedOnRevenueController {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const useTopNewCustomersBasedOnRevenueController = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
}: IUseTopNewCustomersBasedOnRevenueController) => {
  const topNewCustomersBasedOnRevenue = useTopNewCustomersBasedOnRevenue(
    workspaceId,
    environment,
    'totalRevenue',
    false,
    startDate,
    endDate
  );

  const workspaceDetailsDashboard = useWorkspaceDetailsDashboard(workspaceId);

  const topNewCustomersBasedOnRevenueColumns = useMemo(
    () => [
      {
        title: t('common.labels.user_id'),
        dataIndex: 'title',
        render: (
          userId: string,
          record: ITopNewCustomersBasedOnRevenueResponse
        ) => (
          <>
            <div className="table-text">
              <p className="text-truncate text-blue">
                {record.userId ? record.userId : '-'}
              </p>
            </div>
          </>
        ),
      },
      {
        title: t('common.labels.page_viewed'),
        dataIndex: 'pageViewed',
        render: (
          categoryViewed: number,
          record: ITopNewCustomersBasedOnRevenueResponse
        ) => (
          <>
            <div className="table-text">
              {record.pageViewed ? record.pageViewed : '-'}
            </div>
          </>
        ),
      },
      {
        title: t('common.labels.category_viewed'),
        dataIndex: 'categoryViewed',
        render: (
          categoryViewed: number,
          record: ITopNewCustomersBasedOnRevenueResponse
        ) => (
          <>
            <div className="table-text">
              {record.categoryViewed ? record.categoryViewed : '-'}
            </div>
          </>
        ),
      },
      {
        title: t('common.labels.product_searched'),
        dataIndex: 'productSearched',
        render: (
          categoryViewed: number,
          record: ITopNewCustomersBasedOnRevenueResponse
        ) => (
          <>
            <div className="table-text">
              {record.productSearched ? record.productSearched : '-'}
            </div>
          </>
        ),
      },
      {
        title: t('common.labels.product_viewed'),
        dataIndex: 'productViewed',
        render: (
          categoryViewed: number,
          record: ITopNewCustomersBasedOnRevenueResponse
        ) => (
          <>
            <div className="table-text">
              {record.productViewed ? record.productViewed : '-'}
            </div>
          </>
        ),
      },
      {
        title: t('common.labels.product_added_to_cart'),
        dataIndex: 'productAddedToCart',
        render: (
          categoryViewed: number,
          record: ITopNewCustomersBasedOnRevenueResponse
        ) => (
          <>
            <div className="table-text">
              {record.productAddedToCart ? record.productAddedToCart : '-'}
            </div>
          </>
        ),
      },
      {
        title: t('common.labels.checkout_initiated'),
        dataIndex: 'checkoutInitiated',
        render: (
          categoryViewed: number,
          record: ITopNewCustomersBasedOnRevenueResponse
        ) => (
          <>
            <div className="table-text">
              {record.checkoutInitiated ? record.checkoutInitiated : '-'}
            </div>
          </>
        ),
      },
      {
        title: t('common.labels.order_placed'),
        dataIndex: 'ordersPlaced',
        render: (
          categoryViewed: number,
          record: ITopNewCustomersBasedOnRevenueResponse
        ) => (
          <>
            <div className="table-text">
              {record.ordersPlaced ? record.ordersPlaced : '-'}
            </div>
          </>
        ),
      },
      {
        title: t('common.labels.total_revenue'),
        dataIndex: 'totalRevenue',
        render: (
          categoryViewed: number,
          record: ITopNewCustomersBasedOnRevenueResponse
        ) => (
          <>
            <div className="table-text">
              {record.totalRevenue && workspaceDetailsDashboard.data?.currency
                ? currencyFormatter(
                    workspaceDetailsDashboard.data?.currency,
                    record.totalRevenue
                  )
                : '-'}
            </div>
          </>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      t,
      workspaceDetailsDashboard.isSuccess,
      workspaceDetailsDashboard.data,
      workspaceDetailsDashboard.data?.currency,
    ]
  );

  return {
    topNewCustomersBasedOnRevenue,
    topNewCustomersBasedOnRevenueColumns,
  };
};

export default useTopNewCustomersBasedOnRevenueController;
