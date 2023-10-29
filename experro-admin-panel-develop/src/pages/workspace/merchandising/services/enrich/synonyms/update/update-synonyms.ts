import { useMutation } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  ISynonyms,
} from '../../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';
import shapeCollection from '../../../../../../../utills/convert-request-response';

const updateSynonyms = async (
  values: ISynonyms,
  synonymsId: string,
  workspaceId: string
) => {
  const response = await apiClient.patch<ISynonyms, IAxiosResponse<string>>(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/synonyms/${synonymsId}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );
  return response.response.Data;
};

const useUpdateSynonyms = (synonymsId: string, workspaceId: string) =>
  useMutation<string, IAPIError, ISynonyms>(
    [API_MUTATION_KEY.UPDATE_SYNONYMS],
    (values) => updateSynonyms(values, synonymsId, workspaceId)
  );

export default useUpdateSynonyms;
