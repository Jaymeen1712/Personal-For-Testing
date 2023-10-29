import { useMutation } from 'react-query';

import {
  IAPIError,
  IAxiosResponse,
  ICreateWorkspaceResponse,
  IWorkspace,
} from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills/enums';
import shapeCollection from '../../../utills/convert-request-response';
import apiClient from '../../api-client';

const createWorkspace = async (workspace: IWorkspace) => {
  workspace.name = workspace.name && workspace.name.replace(/  +/g, ' ');
  const result = await apiClient.post<
    IWorkspace,
    IAxiosResponse<{ item: ICreateWorkspaceResponse }>
  >(
    APIS_ROUTES.WORKSPACE_LANGUAGES,
    shapeCollection(workspace, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};

const useCreateWorkspace = () =>
  useMutation<ICreateWorkspaceResponse, IAPIError, IWorkspace>(
    [API_MUTATION_KEY.ADD_WORKSPACE],
    createWorkspace
  );

export default useCreateWorkspace;
