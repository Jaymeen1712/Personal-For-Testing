import { useQuery } from 'react-query';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';
import { IAxiosResponse, IListEnvironments } from '../../../../../types';

interface ISessionByTrafficSourcesResponse {
  source: string;
  sessionCount: number;
}

const sessionByTrafficSources = async (
  workspaceId: string,
  environmentId: string | null,
  segment: string,
  startDate?: string,
  endDate?: string
) => {
  if (!workspaceId || !environmentId || !startDate || !endDate) {
    return;
  } else {
    const response = await apiClient.get<
      string,
      { response: ISessionByTrafficSourcesResponse[] }
    >(`${APIS_ROUTES.SESSION_BY_TRAFFIC}`, {
      params: {
        date_range: 'CUSTOM',
        segment: segment,
        start_date: startDate,
        end_date: endDate,
        start: 0,
        rows: 10,
        break_by_date: false,
        frequency: 'days',
      },
      headers: {
        'x-workspace-id': workspaceId,
        // @ts-ignore
        'x-env-id': environmentId,
      },
    });

    const environments = await apiClient.get<
      null,
      IAxiosResponse<IListEnvironments[]>
    >(`${APIS_ROUTES.ENVIRONMENT_SERVICE}/${workspaceId}/environments`);

    if (response && response.response && response.response.length > 0) {
      for (let i = 0; i <= response.response.length - 1; i++) {
        if (
          environments &&
          environments.response.Data &&
          environments.response.Data.length > 0
        ) {
          for (let j = 0; j <= environments.response.Data.length - 1; j++) {
            if (
              (response.response[i]?.source &&
                response.response[i]?.source !== undefined &&
                (response.response[i]?.source.includes('localhost:3000') ||
                  response.response[i]?.source.includes('localhost:3001') ||
                  response.response[i]?.source.includes('N/A'))) ||
              (environments.response?.Data[j]?.customDomain &&
                environments.response?.Data[j]?.customDomain !== '' &&
                environments.response?.Data[j]?.customDomain.length > 0 &&
                environments.response?.Data[j]?.customDomain.includes(
                  response.response[i]?.source
                )) ||
              (environments.response?.Data[j]?.cacheDomain &&
                environments.response?.Data[j]?.cacheDomain !== '' &&
                // @ts-ignore
                environments.response?.Data[j]?.cacheDomain.length > 0 &&
                // @ts-ignore
                environments.response?.Data[j]?.cacheDomain.includes(
                  response.response[i]?.source
                )) ||
              (environments.response?.Data[j]?.workspaceDomain &&
                environments.response?.Data[j]?.workspaceDomain !== '' &&
                environments.response?.Data[j]?.workspaceDomain.length > 0 &&
                environments.response.Data[j].workspaceDomain.includes(
                  response?.response[i]?.source
                ))
            ) {
              response.response.splice(i, 1);
            }
          }
        } else {
          if (
            response.response[i].source &&
            response.response[i].source !== undefined &&
            (response.response[i].source.includes('localhost:3000') ||
              response.response[i].source.includes('localhost:3001') ||
              response.response[i].source.includes('N/A'))
          ) {
            response.response.splice(i, 1);
          }
        }
      }
    }

    return response.response;
  }
};

const useSessionByTrafficSources = (
  workspaceId: string,
  environmentId: string | null,
  segment: string,
  startDate?: string,
  endDate?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.SESSION_BY_TRAFFIC_SOURCES,
      workspaceId,
      environmentId,
      segment,
      startDate,
      endDate,
    ],
    () =>
      sessionByTrafficSources(
        workspaceId,
        environmentId,
        segment,
        startDate,
        endDate
      )
  );

export default useSessionByTrafficSources;
