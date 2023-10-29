import { useQuery } from 'react-query';
import Cookies from 'js-cookie';

import {
  API_QUERY_KEY,
  APIS_ROUTES,
  USER_ACCESS_KEY,
} from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';
import { IAPIError, IAxiosResponse } from '../../../../../types';

interface PermissionResponse {
  item: { [key: string]: boolean };
}

const getPermissions = async (workspaceId?: string, isWaiting?: boolean) => {
  if (!Cookies.get(USER_ACCESS_KEY.TOKEN) || isWaiting) return;

  const result = await apiClient.get<null, IAxiosResponse<PermissionResponse>>(
    APIS_ROUTES.PERMISSIONS,
    { params: { workspaceId: workspaceId ? workspaceId : undefined } }
  );

  return result.response.Data;
};

const useGetPermissions = (workspaceId?: string, isWaiting?: boolean) =>
  useQuery<PermissionResponse | undefined, IAPIError>(
    [API_QUERY_KEY.PERMISSIONS, workspaceId, isWaiting],
    () => getPermissions(workspaceId, isWaiting)
  );

export default useGetPermissions;
