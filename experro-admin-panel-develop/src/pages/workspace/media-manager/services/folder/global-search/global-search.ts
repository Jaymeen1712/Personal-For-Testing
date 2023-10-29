import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';
import {
  GridParams,
  IAxiosResponse,
  IGlobalSearchFolders,
} from '../../../../../../types';

const globalSearchFolders = async (
  workspaceId: string,
  searchText: string,
  limit: number,
  fileTypeFilter: string,
  folderId: string,
  params?: GridParams
) => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<IGlobalSearchFolders>
  >(`${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/search-folders`, {
    params: {
      ...params,
      filterByType: fileTypeFilter,
      search: searchText,
      skip: 0,
      limit: limit,
      folderFields: 'parent_folder_id,created_by,modified_at,name',
      folderId: folderId,
    },
  });
  return result.response.Data;
};

const useGlobalSearchFolders = (
  workspaceId: string,
  searchText: string,
  limit: number,
  fileTypeFilter: string,
  folderId?: string,
  params?: GridParams
) =>
  useQuery(
    [
      API_QUERY_KEY.GLOBAL_FOLDER_LIST,
      workspaceId,
      searchText,
      fileTypeFilter,
      folderId,
      params,
    ],
    () =>
      globalSearchFolders(
        workspaceId,
        searchText,
        limit,
        fileTypeFilter,
        folderId || '',
        params
      ),
    { enabled: searchText?.length > 0 }
  );

export default useGlobalSearchFolders;
