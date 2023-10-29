import axios from 'axios';
import Cookies from 'js-cookie';
import { useQuery } from 'react-query';

import { API_QUERY_KEY, USER_ACCESS_KEY } from '../../../../../utills';

const listDetails = async (
  workspaceId: string,
  environmentId: string | null,
  start: number,
  filter?: string
) => {
  if (!workspaceId || !environmentId) {
    return;
  } else {
    const apiClient = await axios.create({
      baseURL: process.env.REACT_APP_API_URL,
    });
    const result = await apiClient.get(
      `https://admin.experro-dev.app/apis/analytics-service/v1/users/search`,
      {
        headers: {
          // @ts-ignore
          'x-tenant-id': Cookies.get(USER_ACCESS_KEY.TENANT_ID),
          // 'x-tenant-id': 'a5a9d68e-2c1c-4caa-a802-74d9909a1547',
          // 'x-workspace-id': '80ffa75b-eb93-4cbd-b40c-a87714bcf3d6',
          'x-workspace-id': workspaceId,
          'x-env-id': environmentId,
          // 'x-env-id':
          //   'PRODUCTION-80ffa75b-eb93-4cbd-b40c-a87714bcf3d6-z91vhbv7',
          // @ts-ignore
          // 'x-workspace-hash': 'h4xluy04',
          'x-workspace-hash': Cookies.get(USER_ACCESS_KEY.STORE_LINK),
        },
        params: {
          rows: 20,
          start: start,
        },
      }
    );

    // @ts-ignore
    return result.data;
  }
};

const useListDetails = (
  workspaceId: string,
  environmentId: string | null,
  start: number,
  filter?: string
) =>
  useQuery(
    [API_QUERY_KEY.LIST_AUDIENCE, workspaceId, environmentId],
    () => listDetails(workspaceId, environmentId, start, filter),
    {
      cacheTime: 0,
    }
  );

export default useListDetails;
