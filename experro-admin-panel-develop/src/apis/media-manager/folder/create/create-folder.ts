import { useMutation } from 'react-query';

import apiClient from '../../../api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills';
import { IAPIError, IAxiosResponse } from '../../../../types';

const createFolder = async (
  workspaceId: string,
  parentFolderId: string,
  name: string
) => {
  const result = await apiClient.post<
    { name: string },
    IAxiosResponse<{ item: string }>
  >(
    `${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/folders/${parentFolderId}/sub-folders`,
    { name }
  );

  return result.response.Data.item;
};

const useCreateFolder = (workspaceId: string, parentFolderId: string) =>
  useMutation<string, IAPIError, string>(
    [API_MUTATION_KEY.CREATE_FOLDER],
    (name) => createFolder(workspaceId, parentFolderId, name)
  );

export default useCreateFolder;
