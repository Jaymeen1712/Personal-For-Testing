import { useMutation } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  ISynonyms,
} from '../../../../../../../types';
import shapeCollection from '../../../../../../../utills/convert-request-response';

const createSynonyms = async (workspaceId: string, values: ISynonyms) => {
  const result = await apiClient.post<
    { name: string },
    IAxiosResponse<{ item: string }>
  >(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/synonyms`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};

const useCreateSynonyms = (workspaceId: string) =>
  useMutation<string, IAPIError, ISynonyms>(
    [API_MUTATION_KEY.CREATE_SYNONYMS],
    (values) => createSynonyms(workspaceId, values)
  );

export default useCreateSynonyms;
