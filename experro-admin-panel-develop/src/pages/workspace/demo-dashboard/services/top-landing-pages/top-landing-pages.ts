import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

interface ITopLandingPagesResponse {
  eventCount: number;
  newUserEventcount: number;
  newUsers: number;
  totalUsers: number;
  view: string;
}

const topLandingPages = async (
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
    const response = await apiClient.get<
      string,
      { response: ITopLandingPagesResponse[] }
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
        rows: 10,
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

const useTopLandingPages = (
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
      API_QUERY_KEY.TOP_LANDING_PAGES,
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
      topLandingPages(
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

export default useTopLandingPages;
