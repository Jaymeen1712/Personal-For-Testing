import { useQuery } from 'react-query';

import apiClient from '../../../api-client';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';
import { IAPIError, IAxiosResponse, IFileDetails } from '../../../../types';

const detailsFile = async (
  workspaceId: string,
  folderId: string,
  fileId: string | null
) => {
  if (!folderId || !fileId) return;

  const result = await apiClient.get<
    string,
    IAxiosResponse<{ item: IFileDetails }>
  >(
    `${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/folders/${folderId}/files/${fileId}`,
    {
      params: {
        fields:
          'size,created_at,caption,folder_id,alt_text,description,created_by,modified_at',
      },
    }
  );

  return result.response.Data.item;
};

const useDetailsFile = (
  workspaceId: string,
  folderId: string,
  fileId: string | null
) =>
  useQuery<IFileDetails | undefined, IAPIError>(
    [API_QUERY_KEY.FILE_DETAILS, folderId, fileId],
    () => detailsFile(workspaceId, folderId, fileId)
  );

export default useDetailsFile;
