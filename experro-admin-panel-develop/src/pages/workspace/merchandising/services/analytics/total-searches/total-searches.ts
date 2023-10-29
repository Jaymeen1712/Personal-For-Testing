import { useQuery } from 'react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  API_QUERY_KEY,
  APIS_ROUTES,
  USER_ACCESS_KEY,
} from '../../../../../../utills';

const TotalSearches = async (
  workspaceId: string,
  event: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string
) => {
  if (!workspaceId || !environmentId || !event || !startDate || !endDate) {
    return;
  } else {
    const apiClient = await axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });

    const response = await apiClient.get(`${APIS_ROUTES.TOTAL_SEARCHES}`, {
      params: {
        event: event,
        date_range: 'CUSTOM',
        start_date: startDate,
        end_date: endDate,
        metrics: 'total_count',
      },
      headers: {
        // @ts-ignore
        'x-tenant-id': Cookies.get(USER_ACCESS_KEY.TENANT_ID),
        'x-workspace-id': workspaceId,
        'x-env-id': environmentId,
      },
    });

    if (response.data === null || response.data === '') {
      return [{ eventName: event, sum: 0 }];
    } else {
      return response.data;
    }
  }
};

const useTotalSearches = (
  workspaceId: string,
  event: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.TOTAL_SEARCHES,
      workspaceId,
      environmentId,
      startDate,
      endDate,
      event,
    ],
    () => TotalSearches(workspaceId, event, environmentId, startDate, endDate),
    { cacheTime: 0 }
  );

export default useTotalSearches;
