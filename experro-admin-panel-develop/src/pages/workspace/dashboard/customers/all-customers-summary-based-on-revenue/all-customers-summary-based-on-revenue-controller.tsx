import { TFunction } from 'react-i18next';
import {
  useTopNewCustomersBasedOnRevenue,
  useWorkspaceDetailsDashboard,
} from '../../services';
import React, { useMemo, useState } from 'react';
import { currencyFormatter, PAGE_SIZE } from '../../../../../utills';

interface IAllCustomersSummaryBasedOnRevenueResponse {
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

interface IUseAllCustomersSummaryBasedOnRevenueController {
  t: TFunction<'translation', undefined>;
  workspaceId: string;
  environment: string | null;
  startDate?: string;
  endDate?: string;
}

const useAllCustomersSummaryBasedOnRevenueController = ({
  t,
  workspaceId,
  environment,
  startDate,
  endDate,
}: IUseAllCustomersSummaryBasedOnRevenueController) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const allCustomersSummaryBasedOnRevenue = useTopNewCustomersBasedOnRevenue(
    workspaceId,
    environment,
    'totalRevenue',
    true,
    startDate,
    endDate
  );

  const workspaceDetailsDashboard = useWorkspaceDetailsDashboard(workspaceId);

  const allCustomersSummaryBasedOnRevenueColumns = useMemo(
    () => [
      {
        title: t('common.labels.user_id'),
        dataIndex: 'title',
        render: (
          userId: string,
          record: IAllCustomersSummaryBasedOnRevenueResponse
        ) => (
          <>
            <div className="table-text">
              <p className="text-truncate">
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
          record: IAllCustomersSummaryBasedOnRevenueResponse
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
          record: IAllCustomersSummaryBasedOnRevenueResponse
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
          record: IAllCustomersSummaryBasedOnRevenueResponse
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
          record: IAllCustomersSummaryBasedOnRevenueResponse
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
          record: IAllCustomersSummaryBasedOnRevenueResponse
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
          record: IAllCustomersSummaryBasedOnRevenueResponse
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
          record: IAllCustomersSummaryBasedOnRevenueResponse
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
          record: IAllCustomersSummaryBasedOnRevenueResponse
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

  const pagination = useMemo(
    () => ({
      total: allCustomersSummaryBasedOnRevenue.data?.length,
      pageSize: pageSize,
      showSizeChanger: true,
      current: page,
      hideOnSinglePage: !!(
        allCustomersSummaryBasedOnRevenue.data &&
        allCustomersSummaryBasedOnRevenue.data.length &&
        allCustomersSummaryBasedOnRevenue.data.length < PAGE_SIZE
      ),
      pageSizeOptions: [5, 10, 20, 50, 100],
      locale: { items_per_page: ' per page' },
      onChange: (page: number, pageSize: number) => {
        setPageSize(pageSize);
        setPage(page);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      allCustomersSummaryBasedOnRevenue.data,
      setPage,
      page,
      pageSize,
      setPageSize,
    ]
  );

  return {
    allCustomersSummaryBasedOnRevenue,
    allCustomersSummaryBasedOnRevenueColumns,
    pagination,
  };
};

export default useAllCustomersSummaryBasedOnRevenueController;
