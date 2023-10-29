import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';
import {
  GridParams,
  IAxiosResponse,
  IGlobalSearchFiles,
} from '../../../../../../types';

const globalSearchFiles = async (
  workspaceId: string,
  searchText: string,
  limit: number,
  fileTypeFilter: string,
  folderId: string,
  isPopUp?: boolean,
  params?: GridParams
) => {
  const result = await apiClient.get<null, IAxiosResponse<IGlobalSearchFiles>>(
    `${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/search-files`,
    {
      params: {
        ...params,
        search: searchText,
        skip: 0,
        limit,
        filterByType: fileTypeFilter,
        fileFields: '*',
        folderId: folderId,
        // isPopup: isPopUp,
      },
    }
  );
  return result.response.Data;
};

const useGlobalSearchFiles = (
  workspaceId: string,
  searchText: string,
  limit: number,
  fileTypeFilter: string,
  isPopUp?: boolean,
  folderId?: string,
  params?: GridParams
) =>
  useQuery(
    [
      API_QUERY_KEY.GLOBAL_FILE_LIST,
      workspaceId,
      searchText,
      folderId,
      params,
      fileTypeFilter,
    ],
    () =>
      globalSearchFiles(
        workspaceId,
        searchText,
        limit,
        fileTypeFilter,
        folderId || '',
        isPopUp,
        params
      ),
    { enabled: searchText?.length > 0 }
  );

export default useGlobalSearchFiles;
