import { useQuery } from 'react-query';

import apiClient from '../../../../api-client';
import { IAPIError, IAxiosResponse, ISubFolder } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const listSubFolder = async (workspaceId: string, folderId?: string) => {
  if (!folderId) return;

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: ISubFolder[] }>
  >(
    `${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/folders/${folderId}/sub-folders`,
    { params: { fields: 'created_at,modified_at' } }
  );

  return result.response.Data.items;
};

const useListSubFolder = (workspaceId: string, folderId?: string) =>
  useQuery<ISubFolder[] | undefined, IAPIError>(
    [API_QUERY_KEY.SUB_FOLDER_LIST, workspaceId, folderId],
    () => listSubFolder(workspaceId, folderId),
    { cacheTime: 0 }
  );

export default useListSubFolder;
