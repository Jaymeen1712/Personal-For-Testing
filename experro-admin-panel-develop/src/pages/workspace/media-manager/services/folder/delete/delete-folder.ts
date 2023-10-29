import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAPIError } from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';

const deleteFolder = async (folderId: string, workspaceId: string) => {
  await apiClient.delete(
    `${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/folders/${folderId}`
  );
};

const useDeleteFolder = (workspaceId: string) =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.DELETE_FOLDER],
    (folderId) => deleteFolder(folderId, workspaceId)
  );

export default useDeleteFolder;
