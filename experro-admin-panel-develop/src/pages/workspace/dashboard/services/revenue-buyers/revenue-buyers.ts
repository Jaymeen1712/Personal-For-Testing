import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

interface IRevenueBuyers {
  eventSum: number;
  newUserEventsum: number;
  newUsers: number;
  totalUsers: number;
}

const revenueBuyers = async (
  workspaceId: string,
  environmentId: string | null,
  metrics: string,
  event: string,
  aggregateFunction: string,
  startDate?: string,
  endDate?: string
) => {
  if (!workspaceId || !environmentId || !startDate || !endDate) {
    return;
  } else {
    const response = await apiClient.get<
      string,
      { response: IRevenueBuyers[] }
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

    return response.response;
  }
};

const useRevenueBuyers = (
  workspaceId: string,
  environmentId: string | null,
  metrics: string,
  event: string,
  aggregateFunction: string,
  startDate?: string,
  endDate?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.REVENUE_BUYER,
      workspaceId,
      environmentId,
      metrics,
      event,
      aggregateFunction,
      startDate,
      endDate,
    ],
    () =>
      revenueBuyers(
        workspaceId,
        environmentId,
        metrics,
        event,
        aggregateFunction,
        startDate,
        endDate
      )
  );

export default useRevenueBuyers;
