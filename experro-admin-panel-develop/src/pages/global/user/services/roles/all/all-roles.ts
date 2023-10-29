import { useQuery } from 'react-query';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';
import apiClient from '../../../../../../apis/api-client';
import {
  IAxiosResponse,
  IRole,
  IRoleListResponse,
} from '../../../../../../types';

const allRoles = async () => {
  const result = await apiClient.get<IRole, IAxiosResponse<IRoleListResponse>>(
    APIS_ROUTES.ROLES
  );

  return result.response.Data.items.map((role) => ({
    ...role,
    workspaceName: role.workspaceName === '' ? 'Global' : role.workspaceName,
  }));
};

const useAllRoles = () =>
  useQuery([API_QUERY_KEY.ALL_ROLES], allRoles, { cacheTime: 0 });

export default useAllRoles;
