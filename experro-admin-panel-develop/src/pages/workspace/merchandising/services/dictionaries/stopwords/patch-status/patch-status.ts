import { useMutation } from 'react-query';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  IPatchStopWords,
} from '../../../../../../../types';
import apiClient from '../../../../../../../apis/api-client';
import shapeCollection from '../../../../../../../utills/convert-request-response';

const patchStopWordsStatus = async (
  stopWordsData: IPatchStopWords,
  workspaceId?: string
) => {
  const response = await apiClient.patch<
    IPatchStopWords,
    IAxiosResponse<{ message: string }>
  >(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/stop-words/update-status`,
    shapeCollection(stopWordsData, false, 'camelToSnackCase')
  );

  return response.response.Data.message;
};

const usePatchStopWordsStatus = (workspaceId: string) =>
  useMutation<string, IAPIError, IPatchStopWords>(
    [API_MUTATION_KEY.PATCH_SPELL_CHECK_STATUS],
    (stopWordsData) => patchStopWordsStatus(stopWordsData, workspaceId)
  );

export default usePatchStopWordsStatus;
