import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';
import {
  IAPIError,
  IAxiosResponse,
  IRecentlyScheduledRecordsDashboardResponse,
} from '../../../types';

const recentlyScheduledRecordsDashboard = async (
  workspaceId: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string
) => {
  if (!workspaceId || !environmentId || !startDate || !endDate) return;

  const response = await apiClient.get<
    string,
    IAxiosResponse<IRecentlyScheduledRecordsDashboardResponse[]>
  >(`${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/content-model-record`, {
    params: {
      environment_id: environmentId,
      skip: 0,
      limit: 10,
      sort_by: 'scheduled_at',
      order_by: 'desc',
      start_date: startDate,
      end_date: endDate,
    },
  });

  return response.response.Data;
};

const useRecentlyScheduledRecordsDashboard = (
  workspaceId: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string
) =>
  useQuery<IRecentlyScheduledRecordsDashboardResponse[] | undefined, IAPIError>(
    [
      API_QUERY_KEY.RECENTLY_SCHEDULED_RECORDS_DASHBOARD,
      workspaceId,
      environmentId,
      startDate,
      endDate,
    ],
    () =>
      recentlyScheduledRecordsDashboard(
        workspaceId,
        environmentId,
        startDate,
        endDate
      ),
    { cacheTime: 0 }
  );

export default useRecentlyScheduledRecordsDashboard;
