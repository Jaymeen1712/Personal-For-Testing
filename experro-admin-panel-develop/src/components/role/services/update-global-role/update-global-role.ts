import { useMutation } from 'react-query';

import {
  IAxiosResponse,
  ICreateRoleResponse,
  IRole,
  IAPIError,
} from '../../../../types';
import shapeCollection from '../../../../utills/convert-request-response';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../utills/enums';
import apiClient from '../../../../apis/api-client';

const updateGlobalRole = async (role: IRole, roleId?: string) => {
  const response = await apiClient.put<
    IRole,
    IAxiosResponse<ICreateRoleResponse>
  >(
    `${APIS_ROUTES.ROLES}/${roleId}`,
    shapeCollection(role, false, 'camelToSnackCase')
  );
  return response.response.Data;
};

const useUpdateGlobalRole = (roleId?: string) =>
  useMutation<ICreateRoleResponse, IAPIError, IRole>(
    [API_MUTATION_KEY.UPDATE_GLOBAL_ROLE, roleId],
    (role: IRole) => updateGlobalRole(role, roleId)
  );

export default useUpdateGlobalRole;
