import { useQuery } from 'react-query';

import apiClient from '../../../api-client';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';
import { IAxiosResponse, IGlobalSearchFolders } from '../../../../types';

const globalSearchFolders = async (
  workspaceId: string,
  searchText: string,
  limit: number
) => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<IGlobalSearchFolders>
  >(
    `${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/search-folders?search=${searchText}&skip=0&limit=${limit}&folderFields=parent_folder_id,created_by,modified_at,name`
  );
  return result.response.Data;
};

const useGlobalSearchFolders = (
  workspaceId: string,
  searchText: string,
  limit: number
) =>
  useQuery(
    [API_QUERY_KEY.GLOBAL_FOLDER_LIST, workspaceId, searchText],
    () => globalSearchFolders(workspaceId, searchText, limit),
    { enabled: searchText?.length > 0 }
  );

export default useGlobalSearchFolders;
