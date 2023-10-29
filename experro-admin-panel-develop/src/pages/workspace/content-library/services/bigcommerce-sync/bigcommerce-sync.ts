import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import { IAPIError, IAxiosResponse, ICreateTitle } from '../../../../../types';
import shapeCollection from '../../../../../utills/convert-request-response';
import apiClient from '../../../../../apis/api-client';

const bigCommerceSync = async (
  workspaceId: string,
  values: {
    store_details: {
      id: string;
    };
    ecommerce_provider?: string;
  }
) => {
  const result = await apiClient.post<
    ICreateTitle,
    IAxiosResponse<{ result: boolean }>
  >(
    `${APIS_ROUTES.ECOMMERCE_SERVICE}/${workspaceId}/ecommerce-stores/sync-object`,
    shapeCollection(values, false, 'camelToSnackCase')
  );
  return result.response.Data.result;
};

const useBigCommerceSync = (workspaceId: string) =>
  useMutation<
    boolean,
    IAPIError,
    {
      store_details: {
        id: string;
      };
      ecommerce_provider?: string;
    }
  >([API_MUTATION_KEY.BIGCOMMERCE_SYNC], (values) =>
    bigCommerceSync(workspaceId, values)
  );

export default useBigCommerceSync;
