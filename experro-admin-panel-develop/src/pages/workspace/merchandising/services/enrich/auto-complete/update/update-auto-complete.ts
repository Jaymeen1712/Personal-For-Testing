import { useMutation } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  ICreateAutoComplete,
} from '../../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';
import shapeCollection from '../../../../../../../utills/convert-request-response';

const updateAutoComplete = async (
  // eslint-disable-next-line
  values: ICreateAutoComplete,
  autoCompleteId: string,
  workspaceId: string
) => {
  const response = await apiClient.put<
    ICreateAutoComplete,
    IAxiosResponse<string>
  >(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/auto-suggester/${autoCompleteId}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );
  return response.response.Data;
};

const useUpdateAutoComplete = (autoCompleteId: string, workspaceId: string) =>
  useMutation<string, IAPIError, ICreateAutoComplete>(
    [API_MUTATION_KEY.UPDATE_AUTO_COMPLETE],
    (values) => updateAutoComplete(values, autoCompleteId, workspaceId)
  );

export default useUpdateAutoComplete;
