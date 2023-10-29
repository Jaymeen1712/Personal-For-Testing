import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAPIError, IAxiosResponse } from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

const productValues = async (
  workspaceId: string,
  productName?: string,
  environmentId?: string
) => {
  if (!productName || productName === undefined || productName === '') return;

  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: string[] }>
  >(
    `${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/contents/content-fields/${productName}/values`,
    {
      params: { environments_id: environmentId },
    }
  );

  return response.response.Data.items;
};

const useProductValues = (
  workspaceId: string,
  productName?: string,
  environmentId?: string
) =>
  useQuery<string[] | undefined, IAPIError>(
    [
      API_QUERY_KEY.PRODUCT_FIELD_VALUE,
      workspaceId,
      productName,
      environmentId,
    ],
    () => productValues(workspaceId, productName, environmentId),
    {
      cacheTime: 0,
    }
  );

export default useProductValues;
