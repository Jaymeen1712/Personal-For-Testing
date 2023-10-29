import { useMutation } from 'react-query';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  IPatchSynonyms,
} from '../../../../../../../types';
import apiClient from '../../../../../../../apis/api-client';
import shapeCollection from '../../../../../../../utills/convert-request-response';

const patchSynonymsStatus = async (
  synonymsData: IPatchSynonyms,
  workspaceId?: string
) => {
  const response = await apiClient.patch<
    IPatchSynonyms,
    IAxiosResponse<{ message: string }>
  >(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/synonyms/update-status`,
    shapeCollection(synonymsData, false, 'camelToSnackCase')
  );

  return response.response.Data.message;
};

const usePatchSynonymsStatus = (workspaceId: string) =>
  useMutation<string, IAPIError, IPatchSynonyms>(
    [API_MUTATION_KEY.PATCH_SYNONYMS_STATUS],
    (synonymsData) => patchSynonymsStatus(synonymsData, workspaceId)
  );

export default usePatchSynonymsStatus;
