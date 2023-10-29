import { useMutation } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  ICreateAutoComplete,
} from '../../../../../../../types';
import shapeCollection from '../../../../../../../utills/convert-request-response';

const createAutoComplete = async (
  workspaceId: string,
  values: ICreateAutoComplete
) => {
  const result = await apiClient.post<
    { name: string },
    IAxiosResponse<{ item: string }>
  >(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/auto-suggester`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};

const useCreateAutoComplete = (workspaceId: string) =>
  useMutation<string, IAPIError, ICreateAutoComplete>(
    [API_MUTATION_KEY.CREATE_AUTO_COMPLETE],
    (values) => createAutoComplete(workspaceId, values)
  );

export default useCreateAutoComplete;
