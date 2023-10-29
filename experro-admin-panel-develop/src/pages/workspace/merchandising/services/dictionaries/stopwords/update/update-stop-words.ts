import { useMutation } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { IAPIError, IAxiosResponse } from '../../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';
import shapeCollection from '../../../../../../../utills/convert-request-response';

const updateStopWords = async (
  // eslint-disable-next-line
  values: any,
  stopWordId: string,
  workspaceId: string
) => {
  // eslint-disable-next-line
  const response = await apiClient.patch<any, IAxiosResponse<any>>(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/stop-words/${stopWordId}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );
  return response.response.Data;
};

const useUpdateStopWords = (stopWordId: string, workspaceId: string) =>
  // eslint-disable-next-line
  useMutation<any, IAPIError, any>(
    [API_MUTATION_KEY.UPDATE_STOP_WORDS],
    (values) => updateStopWords(values, stopWordId, workspaceId)
  );

export default useUpdateStopWords;
