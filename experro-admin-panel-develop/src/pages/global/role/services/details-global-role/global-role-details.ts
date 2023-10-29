import { useQuery } from 'react-query';

import {
  IAPIError,
  IRole,
  IAxiosResponse,
  IRoleResponse,
} from '../../../../../types';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../utills/enums';
import apiClient from '../../../../../apis/api-client';

const getGlobalRoleDetails = async (roleId?: string | null) => {
  if (!roleId) return;

  const response = await apiClient.get<IRole, IAxiosResponse<IRoleResponse>>(
    `${APIS_ROUTES.ROLES}/${roleId}`,
    {
      params: {
        fields: 'permissions,description,workspace_id',
      },
    }
  );

  return response.response.Data;
};

const useGetGlobalRoleDetails = (roleId?: string | null) =>
  useQuery<IRoleResponse | undefined, IAPIError, IRole>(
    [API_MUTATION_KEY.GLOBAL_ROLE_DETAILS, roleId],
    () => getGlobalRoleDetails(roleId),
    { cacheTime: 0 }
  );

export default useGetGlobalRoleDetails;
