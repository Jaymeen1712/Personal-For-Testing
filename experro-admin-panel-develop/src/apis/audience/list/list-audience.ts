import axios from 'axios';
import Cookies from 'js-cookie';
import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES, USER_ACCESS_KEY } from '../../../utills';

const listAudience = async (
  workspaceId: string,
  environmentId: string,
  rows: number
) => {
  if (!workspaceId || !environmentId) {
    return;
  } else {
    const apiClient = await axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });

    const result = await apiClient.get(
      `${APIS_ROUTES.ANALYTICS_AUDIENCE}/search`,
      {
        headers: {
          // @ts-ignore
          'x-tenant-id': Cookies.get(USER_ACCESS_KEY.TENANT_ID),
          'x-workspace-id': workspaceId,
          'x-env-id': environmentId,
        },
        params: {
          rows: rows,
          start: 0,
        },
      }
    );

    // @ts-ignore
    return result.data;
  }
};

const useListAudience = (
  workspaceId: string,
  environmentId: string,
  rows: number
) =>
  useQuery(
    [API_QUERY_KEY.LIST_AUDIENCE, workspaceId, environmentId],
    () => listAudience(workspaceId, environmentId, rows),
    {
      cacheTime: 0,
    }
  );

export default useListAudience;
