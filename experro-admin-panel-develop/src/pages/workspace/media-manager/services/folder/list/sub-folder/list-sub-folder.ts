import { useQuery } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import {
  GridParams,
  IAPIError,
  IAxiosResponse,
  ISubFolder,
} from '../../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../../utills';

const listSubFolder = async (
  workspaceId: string,
  fileTypeFilter: string,
  folderId?: string,
  params?: GridParams
) => {
  if (!folderId) return;
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: ISubFolder[] }>
  >(
    `${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/folders/${folderId}/sub-folders`,
    {
      params: {
        // ...params,
        orderBy: params?.orderBy,
        sortBy: params?.sortBy,
        filterByType: fileTypeFilter,
        fields: 'created_at,modified_at',
      },
    }
  );

  return result.response.Data.items;
};

const useListSubFolder = (
  workspaceId: string,
  fileTypeFilter: string,
  folderId?: string,
  params?: GridParams
) =>
  useQuery<ISubFolder[] | undefined, IAPIError>(
    [
      API_QUERY_KEY.SUB_FOLDER_LIST,
      workspaceId,
      fileTypeFilter,
      folderId,
      params,
    ],
    () => listSubFolder(workspaceId, fileTypeFilter, folderId, params),
    { cacheTime: 0 }
  );

export default useListSubFolder;
