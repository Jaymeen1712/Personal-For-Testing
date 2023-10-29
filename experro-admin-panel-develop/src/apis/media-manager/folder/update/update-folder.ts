import { useMutation } from 'react-query';

import apiClient from '../../../api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills';
import { IAPIError } from '../../../../types';

const updateFolder = async (
  workspaceId: string,
  parentFolderId: string | undefined,
  name: string,
  folderId?: string
) => {
  if (!folderId) return;

  await apiClient.patch(
    `${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/folders/${parentFolderId}/sub-folders/${folderId}`,
    { name }
  );
};

const useUpdateFolder = (
  workspaceId: string,
  parentFolderId: string | undefined,
  folderId?: string
) =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.UPDATE_FOLDER],
    (name) => updateFolder(workspaceId, parentFolderId, name, folderId)
  );

export default useUpdateFolder;
