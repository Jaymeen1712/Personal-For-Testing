import { useMutation } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IPhrases,
} from '../../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';
import shapeCollection from '../../../../../../../utills/convert-request-response';

const updatePhrase = async (
  values: IPhrases,
  phraseId: string,
  workspaceId: string
) => {
  const response = await apiClient.patch<IPhrases, IAxiosResponse<string>>(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/phrases/${phraseId}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );
  return response.response.Data;
};

const useUpdatePhrases = (phraseId: string, workspaceId: string) =>
  useMutation<string, IAPIError, IPhrases>(
    [API_MUTATION_KEY.UPDATE_PHRASES],
    (values) => updatePhrase(values, phraseId, workspaceId)
  );

export default useUpdatePhrases;
