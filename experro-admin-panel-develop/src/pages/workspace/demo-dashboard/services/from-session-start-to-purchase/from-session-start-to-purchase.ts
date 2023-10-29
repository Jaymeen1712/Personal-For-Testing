import { useQuery } from 'react-query';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

interface IFromSessionStartToPurchaseResponse {
  eventCount: number;
  newUserEventcount: number;
  newUsers: number;
  totalUsers: number;
}

const fromSessionStartToPurchase = async (
  workspaceId: string,
  environmentId: string | null,
  metrics: string,
  event: string[],
  aggregateFunction: string,
  startDate?: string,
  endDate?: string
) => {
  if (!workspaceId || !environmentId || !startDate || !endDate) {
    return;
  } else {
    const fromSessionStartToPurchaseCategories: string[] = [];
    const fromSessionStartToPurchaseData: number[] = [];

    await Promise.all(
      event.map(async (event) => {
        const response = await apiClient.get<
          string,
          { response: IFromSessionStartToPurchaseResponse[] }
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
          },
          headers: {
            'x-workspace-id': workspaceId,
            // @ts-ignore
            'x-env-id': environmentId,
          },
        });

        if (response && response.response && response.response.length > 0) {
          switch (event) {
            case '[CLY]_view':
              fromSessionStartToPurchaseCategories[0] = 'Page View';
              fromSessionStartToPurchaseData[0] = response.response[0]
                .eventCount
                ? response.response[0].eventCount
                : 0;
              break;
            case 'category_viewed':
              fromSessionStartToPurchaseCategories[1] =
                'Search/Category Viewed';
              fromSessionStartToPurchaseData[1] = response.response[0]
                .eventCount
                ? response.response[0].eventCount
                : 0;
              break;
            case 'product_viewed':
              fromSessionStartToPurchaseCategories[2] = 'Product Viewed';
              fromSessionStartToPurchaseData[2] = response.response[0]
                .eventCount
                ? response.response[0].eventCount
                : 0;
              break;
            case 'product_added_to_cart':
              fromSessionStartToPurchaseCategories[3] = 'Product Added To Cart';
              fromSessionStartToPurchaseData[3] = response.response[0]
                .eventCount
                ? response.response[0].eventCount
                : 0;
              break;
            case 'checkout_initiated':
              fromSessionStartToPurchaseCategories[4] = 'Checkout Initiated';
              fromSessionStartToPurchaseData[4] = response.response[0]
                .eventCount
                ? response.response[0].eventCount
                : 0;
              break;
            case 'checkout_completed':
              fromSessionStartToPurchaseCategories[5] = 'Checkout Completed';
              fromSessionStartToPurchaseData[5] = response.response[0]
                .eventCount
                ? response.response[0].eventCount
                : 0;
              break;
          }
        }
      })
    );

    return {
      fromSessionStartToPurchaseCategories:
        fromSessionStartToPurchaseCategories,
      fromSessionStartToPurchaseData: fromSessionStartToPurchaseData,
    };
  }
};

const useFromSessionStartToPurchase = (
  workspaceId: string,
  environmentId: string | null,
  metrics: string,
  event: string[],
  aggregateFunction: string,
  startDate?: string,
  endDate?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.FROM_SESSION_START_TO_PURCHASE,
      workspaceId,
      environmentId,
      metrics,
      event,
      aggregateFunction,
      startDate,
      endDate,
    ],
    () =>
      fromSessionStartToPurchase(
        workspaceId,
        environmentId,
        metrics,
        event,
        aggregateFunction,
        startDate,
        endDate
      )
  );

export default useFromSessionStartToPurchase;
