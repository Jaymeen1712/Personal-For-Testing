import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IRecentlyModifiedRecordsDashboardResponse,
} from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const recentlyModifiedRecordsDashboard = async (
  workspaceId: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string
) => {
  if (!workspaceId || !environmentId || !startDate || !endDate) return;

  const response = await apiClient.get<
    string,
    IAxiosResponse<IRecentlyModifiedRecordsDashboardResponse[]>
  >(`${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/content-model-record`, {
    params: {
      environment_id: environmentId,
      skip: 0,
      limit: 10,
      sort_by: 'modified_at',
      order_by: 'desc',
      start_date: startDate,
      end_date: endDate,
    },
  });

  return response.response.Data;
};

const useRecentlyModifiedRecordsDashboard = (
  workspaceId: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string
) =>
  useQuery<IRecentlyModifiedRecordsDashboardResponse[] | undefined, IAPIError>(
    [
      API_QUERY_KEY.RECENTLY_MODIFIED_RECORDS_DASHBOARD,
      workspaceId,
      environmentId,
      startDate,
      endDate,
    ],
    () =>
      recentlyModifiedRecordsDashboard(
        workspaceId,
        environmentId,
        startDate,
        endDate
      ),
    { cacheTime: 0 }
  );

export default useRecentlyModifiedRecordsDashboard;
