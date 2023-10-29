import { useQuery } from 'react-query';

import {
  FacetByCategory,
  IAPIError,
  IAxiosResponse,
} from '../../../../../../types';
import apiClient from '../../../../../../apis/api-client';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

const getFacetByCategory = async (
  workspaceId: string,
  environmentId: string,
  category: string
) => {
  if (!environmentId || !category) return {} as FacetByCategory;
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ item: FacetByCategory }>
  >(
    `${APIS_ROUTES.ECOMMERCE_SERVICE}/${workspaceId}/facets/category/${category}`,
    {
      params: {
        environmentId: `${environmentId}`,
      },
    }
  );
  return result.response.Data.item;
};

const useFacetRecordByCategory = (
  workspaceId: string,
  environmentId: string,
  category: string
) =>
  useQuery<FacetByCategory, IAPIError>(
    [API_QUERY_KEY.FACET_LIST_BY_CATEGORY],
    () => getFacetByCategory(workspaceId, environmentId, category),
    {
      cacheTime: 0,
    }
  );

export default useFacetRecordByCategory;
