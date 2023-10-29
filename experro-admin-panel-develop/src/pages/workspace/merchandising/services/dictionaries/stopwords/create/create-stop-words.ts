import { useMutation } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  ICreateStopWords,
} from '../../../../../../../types';
import shapeCollection from '../../../../../../../utills/convert-request-response';

const createStopWords = async (
  workspaceId: string,
  values: ICreateStopWords
) => {
  const result = await apiClient.post<
    { name: string },
    IAxiosResponse<{ item: string }>
  >(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/stop-words`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};

const useCreateStopWords = (workspaceId: string) =>
  useMutation<string, IAPIError, ICreateStopWords>(
    [API_MUTATION_KEY.CREATE_STOP_WORDS],
    (values) => createStopWords(workspaceId, values)
  );

export default useCreateStopWords;
