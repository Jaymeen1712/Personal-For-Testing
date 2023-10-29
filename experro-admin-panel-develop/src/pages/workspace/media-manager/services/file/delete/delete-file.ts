import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAPIError } from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';

export interface IDeleteFile {
  id: string;
  extension: string | undefined;
}

const deleteFile = async (
  workspaceId: string,
  files: string[],
  folderId?: string
) => {
  await apiClient.post(
    `${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/folders/${folderId}/files/delete`,
    { files: files }
  );
};

const useDeleteFile = (workspaceId: string, folderId?: string) =>
  useMutation<void, IAPIError, string[]>(
    [API_MUTATION_KEY.DELETE_FILE],
    (files) => deleteFile(workspaceId, files, folderId)
  );

export default useDeleteFile;
