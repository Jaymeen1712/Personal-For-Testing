import { useMutation } from 'react-query';

import apiClient from '../../api-client';
import { IAPIError } from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';

const deleteWorkSpace = async (workspaceId?: string) => {
  await apiClient.delete(`${APIS_ROUTES.WORKSPACE_LANGUAGES}/${workspaceId}`);
};

const useDeleteWorkspace = (workspaceId?: string) =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.DELETE_WORKSPACE],
    () => deleteWorkSpace(workspaceId)
  );

export default useDeleteWorkspace;
