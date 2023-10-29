import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills';
import { IAPIError } from '../../../../types';
import apiClient from '../../../api-client';

export interface IMoveFileDetails {
  fileId: string;
  targetFolderId: string;
}

const moveFile = async (
  moveFileIds: IMoveFileDetails,
  workspaceId: string,
  folderId?: string
) => {
  if (!moveFileIds.fileId) return;
  await apiClient.patch<IMoveFileDetails>(
    `${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/folders/${folderId}/files/move`,
    moveFileIds
  );
};

const useMoveFile = (workspaceId: string, folderId?: string) =>
  useMutation<void | null, IAPIError, IMoveFileDetails>(
    [API_MUTATION_KEY.MOVE_FILE],
    (moveFileIds) => moveFile(moveFileIds, workspaceId, folderId)
  );

export default useMoveFile;
