import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAPIError, IFileDetails } from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import shapeCollection from '../../../../../../utills/convert-request-response';

const updateFile = async (
  workspaceId: string,
  folderId: string | null,
  fileId: string,
  file: IFileDetails
) => {
  await apiClient.patch(
    `${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/folders/${folderId}/files/${fileId}`,
    shapeCollection(file, false, 'camelToSnackCase')
  );
};

const useUpdateFile = (workspaceId: string, folderId: string, fileId: string) =>
  useMutation<void, IAPIError, IFileDetails>(
    [API_MUTATION_KEY.UPDATE_TOKEN],
    (file) => updateFile(workspaceId, folderId, fileId, file)
  );

export default useUpdateFile;
