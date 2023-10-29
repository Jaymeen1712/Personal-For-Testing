import { useMutation } from 'react-query';

import apiClient from '../../api-client';
import {
  IAPIError,
  IAxiosResponse,
  IEditEnvironment,
  IEditEnvironmentResponse,
} from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import shapeCollection from '../../../utills/convert-request-response';

const updateEnvironment = async (
  environment: IEditEnvironment,
  environmentId?: string,
  workspaceId?: string
) => {
  environment.enableSiteCrawler = false;

  const environmentData = shapeCollection(
    environment,
    false,
    'camelToSnackCase'
  );
  const response = await apiClient.put<
    IEditEnvironment,
    IAxiosResponse<IEditEnvironmentResponse>
  >(
    `${APIS_ROUTES.ENVIRONMENT_SERVICE}/${workspaceId}/environments/${environmentId}`,
    environmentData
  );

  return response.response.Data;
};

const useUpdateEnvironment = (environmentId?: string, workspaceId?: string) =>
  useMutation<IEditEnvironmentResponse, IAPIError, IEditEnvironment>(
    [API_MUTATION_KEY.UPDATE_ENVIRONMENT, workspaceId],
    (environment) => updateEnvironment(environment, environmentId, workspaceId)
  );

export default useUpdateEnvironment;
