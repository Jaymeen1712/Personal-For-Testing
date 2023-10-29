import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IEditEnvironment,
  IEditEnvironmentResponse,
} from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';

const setDefaultEnvironment = async (
  workspaceId: string,
  environmentId: string
) => {
  const response = await apiClient.put<
    IEditEnvironment,
    IAxiosResponse<IEditEnvironmentResponse>
  >(
    `${APIS_ROUTES.ENVIRONMENT_SERVICE}/${workspaceId}/environments/${environmentId}/set-default`,
    { is_default: true }
  );

  return response.response.Data;
};

const useSetDefaultEnvironment = (workspaceId: string) =>
  useMutation<IEditEnvironmentResponse, IAPIError, string>(
    [API_MUTATION_KEY.SET_DEFAULT_ENVIRONMENT, workspaceId],
    (environmentId) => setDefaultEnvironment(workspaceId, environmentId)
  );

export default useSetDefaultEnvironment;
