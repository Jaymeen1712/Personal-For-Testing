import { useMutation } from 'react-query';
import { IAPIError, IAxiosResponse } from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';

interface IMoveVersionToDraft {
  contentModalId: string;
  contentModalDataId: string;
  versionId: string;
}
const moveVersionToDraft = async (
  workspaceId: string,
  value: IMoveVersionToDraft
) => {
  const result = await apiClient.put<
    string,
    IAxiosResponse<{ item: { id: string } }>
  >(
    `${APIS_ROUTES.CONTENT_LIBRARY_SERVICE}/${workspaceId}/contents/${value.contentModalId}/content-model-data/${value.contentModalDataId}/move-version-to-draft/${value.versionId}`
  );
  return result.response.Data.item;
};

const useMoveVersionToDraft = (workspaceId: string) =>
  useMutation<{ id: string }, IAPIError, IMoveVersionToDraft>(
    [API_MUTATION_KEY.MOVE_TO_DRAFT],
    (values) => moveVersionToDraft(workspaceId, values)
  );

export default useMoveVersionToDraft;
