import { useQuery } from 'react-query';

import apiClient from '../../../api-client';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';
import { IAxiosResponse, IGlobalSearchFiles } from '../../../../types';

const globalSearchFiles = async (
  workspaceId: string,
  searchText: string,
  limit: number,
  isPopUp?: boolean
) => {
  const result = await apiClient.get<null, IAxiosResponse<IGlobalSearchFiles>>(
    `${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/search-files?search=${searchText}&skip=0&limit=${limit}&fileFields=size,folder_id,created_by,modified_at,name`,
    {
      params: {
        isPopup: isPopUp,
      },
    }
  );
  return result.response.Data;
};

const useGlobalSearchFiles = (
  workspaceId: string,
  searchText: string,
  limit: number,
  isPopUp?: boolean
) =>
  useQuery(
    [API_QUERY_KEY.GLOBAL_FILE_LIST, workspaceId, searchText],
    () => globalSearchFiles(workspaceId, searchText, limit, isPopUp),
    { enabled: searchText?.length > 0 }
  );

export default useGlobalSearchFiles;
