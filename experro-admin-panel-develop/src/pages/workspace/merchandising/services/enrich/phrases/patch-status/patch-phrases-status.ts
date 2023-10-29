import { useMutation } from 'react-query';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  IPatchPhrases,
} from '../../../../../../../types';
import apiClient from '../../../../../../../apis/api-client';
import shapeCollection from '../../../../../../../utills/convert-request-response';

const patchPhrasesStatus = async (
  phrasesData: IPatchPhrases,
  workspaceId?: string
) => {
  const response = await apiClient.patch<
    IPatchPhrases,
    IAxiosResponse<{ message: string }>
  >(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/phrases/update-status`,
    shapeCollection(phrasesData, false, 'camelToSnackCase')
  );

  return response.response.Data.message;
};

const usePatchPhrasesStatus = (workspaceId: string) =>
  useMutation<string, IAPIError, IPatchPhrases>(
    [API_MUTATION_KEY.PATCH_PHRASES_STATUS],
    (phrasesData) => patchPhrasesStatus(phrasesData, workspaceId)
  );

export default usePatchPhrasesStatus;
