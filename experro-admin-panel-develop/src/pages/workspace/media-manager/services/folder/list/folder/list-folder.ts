import { useQuery } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { IAPIError, IAxiosResponse, IFolder } from '../../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../../utills';

const listFolder = async (workspaceId?: string | null) => {
  if (!workspaceId) return;

  const result = await apiClient.get<
    string,
    IAxiosResponse<{ items: IFolder[] }>
  >(`${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/folders`);

  return result.response.Data.items;
};

const useListFolder = (workspaceId?: string) =>
  useQuery<IFolder[] | undefined, IAPIError>(
    [API_QUERY_KEY.FOLDER_LIST, workspaceId],
    () => listFolder(workspaceId),
    { cacheTime: 0 }
  );

export default useListFolder;
