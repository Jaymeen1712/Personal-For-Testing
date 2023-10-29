import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAxiosResponse } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

interface IContentLibraryCountDashboardResponse {
  contentModelDataCount: number;
  contentModelPublishedDataCount: number;
}

const contentLibraryCountDashboard = async (
  workspaceId: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string
) => {
  if (!workspaceId || !environmentId || !startDate || !endDate) return;

  const response = await apiClient.get<
    string,
    IAxiosResponse<IContentLibraryCountDashboardResponse>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/content-model-record/count`,
    {
      params: {
        environment_id: environmentId,
        start_date: startDate,
        end_date: endDate,
      },
    }
  );

  return response.response.Data;
};

const useContentLibraryCountsDashboard = (
  workspaceId: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.CONTENT_LIBRARY_PUBLISHED_RECORDS_AND_ALL_RECORDS_COUNT,
      workspaceId,
      environmentId,
      startDate,
      endDate,
    ],
    () =>
      contentLibraryCountDashboard(
        workspaceId,
        environmentId,
        startDate,
        endDate
      ),
    { cacheTime: 0 }
  );

export default useContentLibraryCountsDashboard;
