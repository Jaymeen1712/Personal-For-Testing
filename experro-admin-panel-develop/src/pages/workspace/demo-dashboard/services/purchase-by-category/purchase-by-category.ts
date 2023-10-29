import { useQuery } from 'react-query';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

interface IPurchaseByCategoryResponse {
  newUserQuantity: number;
  newUsers: number;
  productCategory: string;
  quantity: number;
  totalUsers: number;
}

const purchaseByCategory = async (
  workspaceId: string,
  environmentId: string | null,
  metrics: string,
  event: string,
  aggregateFunction: string,
  segment: string,
  startDate?: string,
  endDate?: string
) => {
  if (!workspaceId || !environmentId || !startDate || !endDate) {
    return;
  } else {
    const categories: string[] = [];
    const quantity: number[] = [];

    const response = await apiClient.get<
      string,
      { response: IPurchaseByCategoryResponse[] }
    >(`${APIS_ROUTES.EVENT_SUMMARY_WITH_USER_STATE}`, {
      params: {
        date_range: 'CUSTOM',
        metrics: metrics,
        start_date: startDate,
        end_date: endDate,
        event: event,
        frequency: 'days',
        break_by_date: false,
        aggregateFunction: aggregateFunction,
        segment: segment,
        start: 0,
        rows: 5,
      },
      headers: {
        'x-workspace-id': workspaceId,
        // @ts-ignore
        'x-env-id': environmentId,
      },
    });

    if (response) {
      if (response.response.length > 0) {
        for (let i = 0; i <= response.response.length - 1; i++) {
          if (
            response.response[i].productCategory !== '' &&
            response.response[i].productCategory !== 'N/A'
          ) {
            categories.push(
              response.response[i].productCategory
                ? response.response[i].productCategory
                : ''
            );
            quantity.push(
              response.response[i].quantity ? response.response[i].quantity : 0
            );
          }
        }
      }
    }

    return {
      categories: categories,
      quantity: quantity,
    };
  }
};

const usePurchaseByCategory = (
  workspaceId: string,
  environmentId: string | null,
  metrics: string,
  event: string,
  aggregateFunction: string,
  segment: string,
  startDate?: string,
  endDate?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.PURCHASE_BY_CATEGORY,
      workspaceId,
      environmentId,
      metrics,
      event,
      aggregateFunction,
      segment,
      startDate,
      endDate,
    ],
    () =>
      purchaseByCategory(
        workspaceId,
        environmentId,
        metrics,
        event,
        aggregateFunction,
        segment,
        startDate,
        endDate
      )
  );

export default usePurchaseByCategory;
