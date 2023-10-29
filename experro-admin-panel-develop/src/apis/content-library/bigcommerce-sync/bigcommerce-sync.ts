import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import { IAPIError, IAxiosResponse, ICreateTitle } from '../../../types';
import shapeCollection from '../../../utills/convert-request-response';
import apiClient from '../../api-client';

const bigCommerceSync = async (workspaceId: string, values: string) => {
  const data = { id: values };
  const result = await apiClient.post<
    ICreateTitle,
    IAxiosResponse<{ result: boolean }>
  >(
    `${APIS_ROUTES.BIGCOMMERCE}/${workspaceId}/bigcommerce-stores/sync-object`,
    shapeCollection(data, false, 'camelToSnackCase')
  );
  return result.response.Data.result;
};

const useBigCommerceSync = (workspaceId: string) =>
  useMutation<boolean, IAPIError, string>(
    [API_MUTATION_KEY.BIGCOMMERCE_SYNC],
    (values) => bigCommerceSync(workspaceId, values)
  );

export default useBigCommerceSync;
