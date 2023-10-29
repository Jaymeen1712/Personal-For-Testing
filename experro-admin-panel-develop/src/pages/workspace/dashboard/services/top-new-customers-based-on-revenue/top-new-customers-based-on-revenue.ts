import { useQuery } from 'react-query';

import {
  API_QUERY_KEY,
  APIS_ROUTES,
  validateEmail,
} from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

interface ITopNewCustomersBasedOnRevenue {
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

const topNewCustomersBasedOnRevenue = async (
  workspaceId: string,
  environmentId: string | null,
  orderBy: string,
  isNewUser: boolean,
  startDate?: string,
  endDate?: string
) => {
  if (!workspaceId || !environmentId || !startDate || !endDate) {
    return;
  } else {
    const topCustomersDetails: ITopNewCustomersBasedOnRevenue[] = [];

    const response = await apiClient.get<
      string,
      { response: ITopNewCustomersBasedOnRevenue[] }
    >(`${APIS_ROUTES.CUSTOMER_SUMMARY}`, {
      params: isNewUser
        ? {
            date_range: 'CUSTOM',
            start_date: startDate,
            end_date: endDate,
            order_by: orderBy,
          }
        : {
            date_range: 'CUSTOM',
            start_date: startDate,
            end_date: endDate,
            order_by: orderBy,
            is_new_user: false,
          },
      headers: {
        'x-workspace-id': workspaceId,
        // @ts-ignore
        'x-env-id': environmentId,
      },
    });

    if (response && response.response && response.response.length > 0) {
      for (let i = 0; i <= response.response.length - 1; i++) {
        if (validateEmail(response.response[i].userId)) {
          topCustomersDetails.push(response.response[i]);
        }
      }
    }

    return topCustomersDetails;
  }
};

const useTopNewCustomersBasedOnRevenue = (
  workspaceId: string,
  environmentId: string | null,
  orderBy: string,
  isNewUser: boolean,
  startDate?: string,
  endDate?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.TOP_NEW_CUSTOMER_BASED_ON_REVENUE,
      workspaceId,
      environmentId,
      orderBy,
      isNewUser,
      startDate,
      endDate,
    ],
    () =>
      topNewCustomersBasedOnRevenue(
        workspaceId,
        environmentId,
        orderBy,
        isNewUser,
        startDate,
        endDate
      )
  );

export default useTopNewCustomersBasedOnRevenue;
