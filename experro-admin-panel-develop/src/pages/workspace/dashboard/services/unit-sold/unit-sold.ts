import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

interface IUnitSold {
  newUserQuantity: number;
  newUsers: number;
  quantity: number;
  totalUsers: number;
}

const unitSold = async (
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
    const response = await apiClient.get<string, { response: IUnitSold[] }>(
      `${APIS_ROUTES.EVENT_SUMMARY_WITH_USER_STATE}`,
      {
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
      }
    );

    return response.response;
  }
};

const useUnitSold = (
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
      API_QUERY_KEY.UNIT_SOLD,
      workspaceId,
      environmentId,
      metrics,
      event,
      aggregateFunction,
      startDate,
      endDate,
    ],
    () =>
      unitSold(
        workspaceId,
        environmentId,
        metrics,
        event,
        aggregateFunction,
        startDate,
        endDate
      )
  );

export default useUnitSold;
