import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills/enums';
import { IAPIError, IAxiosResponse, IWorkspace } from '../../../types';
import shapeCollection from '../../../utills/convert-request-response';
import apiClient from '../../api-client';

const updateWorkspace = async (workspace: IWorkspace, workspaceId?: string) => {
  workspace.name = workspace.name && workspace.name.replace(/  +/g, ' ');
  const response = await apiClient.put<
    IWorkspace,
    IAxiosResponse<{ item: string }>
  >(
    `${APIS_ROUTES.WORKSPACE_LANGUAGES}/${workspaceId}`,
    shapeCollection(workspace, false, 'camelToSnackCase')
  );

  return response.response.Data.item;
};

const useUpdateWorkspace = (workspaceId?: string) =>
  useMutation<string, IAPIError, IWorkspace>(
    [API_MUTATION_KEY.UPDATE_WORKSPACE],
    (workspace) => updateWorkspace(workspace, workspaceId)
  );

export default useUpdateWorkspace;
