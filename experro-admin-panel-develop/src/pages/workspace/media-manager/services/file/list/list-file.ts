import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import {
  API_QUERY_KEY,
  APIS_ROUTES,
  formatFileSize,
} from '../../../../../../utills';
import {
  GridParams,
  IAPIError,
  IAxiosResponse,
  IFile,
} from '../../../../../../types';

const listFile = async (
  workspaceId: string,
  fileTypeFilter: string,
  folderId?: string,
  isPopUp?: boolean,
  params?: GridParams
) => {
  if (!folderId) return;

  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: IFile[]; totalCount?: number }>
  >(`${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/folders/${folderId}/files`, {
    params: { ...params, filterByType: fileTypeFilter },
  });
  return response.response.Data?.items.map((file) => ({
    ...file,
    sizeWithType: formatFileSize(Number(file.size)),
    totalFiles: response.response.Data?.totalCount,
  }));
};

const useListFile = (
  workspaceId: string,
  fileTypeFilter: string,
  folderId?: string,
  isPopUp?: boolean,
  params?: GridParams
) =>
  useQuery<IFile[] | undefined, IAPIError>(
    [
      API_QUERY_KEY.FILE_LIST,
      workspaceId,
      folderId,
      fileTypeFilter,
      ...Object.values(params || {}),
    ],
    () => listFile(workspaceId, fileTypeFilter, folderId, isPopUp, params),
    {
      keepPreviousData: params?.skip !== '0',
      cacheTime: 0,
      enabled: !params?.search,
    }
  );

export default useListFile;
