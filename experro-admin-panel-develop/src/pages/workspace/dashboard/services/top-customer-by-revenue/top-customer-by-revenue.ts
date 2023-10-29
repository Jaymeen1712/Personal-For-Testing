import { useQuery } from 'react-query';

import {
  API_QUERY_KEY,
  APIS_ROUTES,
  kFormatter,
  validateEmail,
} from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

interface ITopCustomerByRevenue {
  eventSum: number;
  newUserEventsum: number;
  newUsers: number;
  totalUsers: number;
  userId: string;
}

const topCustomerByRevenue = async (
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
    const revenue: number[] = [];
    const userId: string[] = [];

    const response = await apiClient.get<
      string,
      { response: ITopCustomerByRevenue[] }
    >(`${APIS_ROUTES.EVENT_SUMMARY_WITH_USER_STATE}`, {
      params: {
        date_range: 'CUSTOM',
        metrics: metrics,
        start_date: startDate,
        end_date: endDate,
        event: event,
        frequency: 'days',
        aggregateFunction: aggregateFunction,
        segment: segment,
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
          // eslint-disable-next-line
          revenue.push(<number>kFormatter(response.response[i].eventSum));
          userId.push(response.response[i].userId);
        }
      }
    }

    return {
      revenue: revenue,
      userId: userId,
    };
  }
};

const useTopCustomerByRevenue = (
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
      API_QUERY_KEY.TOP_CUSTOMER_BY_REVENUE,
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
      topCustomerByRevenue(
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

export default useTopCustomerByRevenue;
