import { useQuery } from 'react-query';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';
import { IAxiosResponse } from '../../../types';

interface IMediaManagerCountDashboardResponse {
  filesCount: number;
  filesSize: string;
}

const mediaManagerCountsDashboard = async (
  workspaceId: string,
  startDate?: string,
  endDate?: string
) => {
  if (!workspaceId || !startDate || !endDate) return;

  const response = await apiClient.get<
    string,
    IAxiosResponse<IMediaManagerCountDashboardResponse>
  >(`${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/files/count`, {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return response.response.Data;
};

const useMediaManagerCountsDashboard = (
  workspaceId: string,
  startDate?: string,
  endDate?: string
) =>
  useQuery(
    [API_QUERY_KEY.MEDIA_MANAGER_FILE_COUNTS, workspaceId, startDate, endDate],
    () => mediaManagerCountsDashboard(workspaceId, startDate, endDate),
    { cacheTime: 0 }
  );

export default useMediaManagerCountsDashboard;
