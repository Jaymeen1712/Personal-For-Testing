import { useQuery } from 'react-query';

import apiClient from '../../api-client';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';
import { IAxiosResponse, IGlobalSearch } from '../../../types';

const globalSearch = async (
  workspaceId: string,
  searchText: string,
  limit: number
) => {
  const result = await apiClient.get<null, IAxiosResponse<IGlobalSearch>>(
    `${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/global-search?search=${searchText}&skip=0&limit=${limit}&fileFields=size&folderFields=parent_folder_id`
  );
  return result.response.Data;
};

const useGlobalSearch = (
  workspaceId: string,
  searchText: string,
  limit: number
) =>
  useQuery(
    [API_QUERY_KEY.GLOBAL_SEARCH, workspaceId, searchText],
    () => globalSearch(workspaceId, searchText, limit),
    { enabled: searchText?.length > 0 }
  );

export default useGlobalSearch;
