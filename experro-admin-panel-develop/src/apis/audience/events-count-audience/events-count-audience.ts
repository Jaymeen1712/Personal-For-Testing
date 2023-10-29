import axios from 'axios';
import Cookies from 'js-cookie';
import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES, USER_ACCESS_KEY } from '../../../utills';

const eventsCountAudience = async (
  deviceId: string,
  event: string,
  workspaceId: string,
  environmentId: string,
  startDate?: string,
  endDate?: string,
  metrics?: string
) => {
  if (!workspaceId || !environmentId || !deviceId || !startDate || !endDate) {
    return;
  } else {
    const apiClient = await axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });

    const result = await apiClient.get(
      `${APIS_ROUTES.ANALYTICS_AUDIENCE}/${deviceId}/eventCount`,
      {
        headers: {
          // @ts-ignore
          'x-tenant-id': Cookies.get(USER_ACCESS_KEY.TENANT_ID),
          'x-workspace-id': workspaceId,
          'x-env-id': environmentId,
        },
        params: {
          event: event,
          date_range: 'CUSTOM',
          start_date: startDate,
          end_date: endDate,
          metrics: metrics,
        },
      }
    );

    // @ts-ignore
    return result.data;
  }
};

const useEventsCountAudience = (
  deviceId: string,
  event: string,
  workspaceId: string,
  environmentId: string,
  startDate?: string,
  endDate?: string,
  metrics?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.EVENTS_AUDIENCE,
      deviceId,
      event,
      startDate,
      endDate,
      workspaceId,
      environmentId,
      metrics,
    ],
    () =>
      eventsCountAudience(
        deviceId,
        event,
        workspaceId,
        environmentId,
        startDate,
        endDate,
        metrics
      ),
    {
      cacheTime: 0,
    }
  );

export default useEventsCountAudience;
