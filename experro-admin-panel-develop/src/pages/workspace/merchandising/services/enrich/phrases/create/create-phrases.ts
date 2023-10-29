import { useMutation } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  IPhrases,
} from '../../../../../../../types';
import shapeCollection from '../../../../../../../utills/convert-request-response';

const createPhrases = async (workspaceId: string, values: IPhrases) => {
  const result = await apiClient.post<
    { name: string },
    IAxiosResponse<{ item: string }>
  >(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/phrases`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};

const useCreatePhrases = (workspaceId: string) =>
  useMutation<string, IAPIError, IPhrases>(
    [API_MUTATION_KEY.CREATE_PHRASES],
    (values) => createPhrases(workspaceId, values)
  );

export default useCreatePhrases;
