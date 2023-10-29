import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills/enums';
import { IAPIError, IAxiosResponse, IWorkspace } from '../../../types';
import shapeCollection from '../../../utills/convert-request-response';
import apiClient from '../../api-client';

const switchWorkspace = async (newWorkspaceId: string) => {
  const result = await apiClient.post<
    IWorkspace,
    IAxiosResponse<{ message: string }>
  >(
    APIS_ROUTES.SWITCH_WORKSPACE,
    shapeCollection(
      { newWorkspaceId: newWorkspaceId },
      false,
      'camelToSnackCase'
    )
  );

  return result.response.Data;
};

const useSwitchWorkspace = () =>
  useMutation<{ message: string }, IAPIError, string>(
    [API_MUTATION_KEY.SWITCH_WORKSPACE_KEY],
    switchWorkspace
  );

export default useSwitchWorkspace;
