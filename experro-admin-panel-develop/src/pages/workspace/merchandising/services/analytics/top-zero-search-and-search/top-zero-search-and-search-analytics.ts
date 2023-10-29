import { useQuery } from 'react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  API_QUERY_KEY,
  APIS_ROUTES,
  USER_ACCESS_KEY,
} from '../../../../../../utills';

const topZeroSearchAndSearchAnalytics = async (
  workspaceId: string,
  event: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string,
  segmentName?: string
) => {
  if (
    !workspaceId ||
    !environmentId ||
    !event ||
    !startDate ||
    !endDate ||
    !segmentName
  ) {
    return;
  } else {
    const apiClient = await axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });

    const response = await apiClient.get(
      `${APIS_ROUTES.TOP_ZERO_SEARCH_AND_SEARCH_RECORDS}`,
      {
        params: {
          event: event,
          date_range: 'CUSTOM',
          start_date: startDate,
          end_date: endDate,
          row: 10,
          start: 0,
          segment_name: segmentName,
          metrics: 'total_count',
        },
        headers: {
          // @ts-ignore
          'x-tenant-id': Cookies.get(USER_ACCESS_KEY.TENANT_ID),
          'x-workspace-id': workspaceId,
          'x-env-id': environmentId,
        },
      }
    );

    return response.data;
  }
};

const useTopZeroSearchAndSearchAnalytics = (
  workspaceId: string,
  event: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string,
  segmentName?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.TOP_ZERO_SEARCH_RECORDS,
      workspaceId,
      environmentId,
      startDate,
      endDate,
      event,
      segmentName,
    ],
    () =>
      topZeroSearchAndSearchAnalytics(
        workspaceId,
        event,
        environmentId,
        startDate,
        endDate,
        segmentName
      ),
    {
      cacheTime: 0,
    }
  );

export default useTopZeroSearchAndSearchAnalytics;
