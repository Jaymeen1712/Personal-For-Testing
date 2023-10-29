import { useQuery } from 'react-query';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

interface ICustomers {
  eventSum: number;
  newUserEventsum: number;
  newUsers: number;
  totalUsers: number;
}

const customers = async (
  workspaceId: string,
  environmentId: string | null,
  metrics: string,
  aggregateFunction: string,
  startDate?: string,
  endDate?: string
) => {
  if (!workspaceId || !environmentId || !startDate || !endDate) {
    return;
  } else {
    const response = await apiClient.get<string, { response: ICustomers[] }>(
      `${APIS_ROUTES.EVENT_SUMMARY_WITH_USER_STATE}`,
      {
        params: {
          date_range: 'CUSTOM',
          metrics: metrics,
          start_date: startDate,
          end_date: endDate,
          frequency: 'days',
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

const useCustomers = (
  workspaceId: string,
  environmentId: string | null,
  metrics: string,
  aggregateFunction: string,
  startDate?: string,
  endDate?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.CUSTOMERS,
      workspaceId,
      environmentId,
      metrics,
      aggregateFunction,
      startDate,
      endDate,
    ],
    () =>
      customers(
        workspaceId,
        environmentId,
        metrics,
        aggregateFunction,
        startDate,
        endDate
      )
  );

export default useCustomers;
