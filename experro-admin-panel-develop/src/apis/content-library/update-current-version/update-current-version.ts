import { useMutation } from 'react-query';
import { IAPIError, IAxiosResponse } from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';

const updateCurrentVersion = async (
  workspaceId: string,
  contentModalId: string,
  contentModalDataId: string,
  id: string
) => {
  const result = await apiClient.put<
    string,
    IAxiosResponse<{ item: { id: string } }>
  >(
    `${APIS_ROUTES.CONTENT_LIBRARY_SERVICE}/${workspaceId}/contents/${contentModalId}/content-model-data/${contentModalDataId}/current-version/${id}`
  );
  return result.response.Data.item;
};
const useUpdateCurrentVersion = (
  workspaceId: string,
  contentModalId: string,
  contentModalDataId: string
) =>
  useMutation<{ id: string }, IAPIError, string>(
    [API_MUTATION_KEY.UPDATE_CURRENT_VERSION, workspaceId],
    (id) =>
      updateCurrentVersion(workspaceId, contentModalId, contentModalDataId, id)
  );

export default useUpdateCurrentVersion;
