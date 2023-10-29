import { useMutation } from 'react-query';

import {
  IAPIError,
  IRole,
  ICreateRoleResponse,
  IAxiosResponse,
} from '../../../../types';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../utills/enums';
import shapeCollection from '../../../../utills/convert-request-response';
import apiClient from '../../../../apis/api-client';

const createGlobalRole = async (role: IRole) => {
  const response = await apiClient.post<
    IRole,
    IAxiosResponse<ICreateRoleResponse>
  >(APIS_ROUTES.ROLES, shapeCollection(role, false, 'camelToSnackCase'));
  return response.response.Data;
};

const useCreateGlobalRole = () =>
  useMutation<ICreateRoleResponse, IAPIError, IRole>(
    [API_MUTATION_KEY.CREATE_GLOBAL_ROLE],
    createGlobalRole
  );

export default useCreateGlobalRole;
