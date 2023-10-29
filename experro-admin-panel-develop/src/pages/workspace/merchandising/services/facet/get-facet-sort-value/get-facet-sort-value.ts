import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAPIError, IAxiosResponse } from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

const getFacetSortValue = async (
  workspaceId: string,
  environmentId: string,
  facetField: string,
  sortBy: string,
  orderBy: string,
  isFieldOrderingEnable: boolean
) => {
  if (!facetField || !sortBy || !isFieldOrderingEnable) return { buckets: [] };
  const result = await apiClient.get<
    null,
    IAxiosResponse<{
      items: {
        buckets: {
          val: string;
          count: number;
        }[];
      };
    }>
  >(
    `${APIS_ROUTES.ECOMMERCE_SERVICE}/${workspaceId}/facets/${facetField}/values/sort-order`,
    {
      params: {
        environments_id: environmentId,
        sort_by: sortBy,
        order_by: orderBy,
        limit: 1000,
      },
    }
  );
  return result.response.Data.items;
};

const useGetFacetSortValue = (
  workspaceId: string,
  environmentId: string,
  facetField: string,
  sortBy: string,
  orderBy: string,
  isFieldOrderingEnable: boolean
) =>
  useQuery<
    {
      buckets: {
        val: string;
        count: number;
      }[];
    },
    IAPIError
  >(
    [API_QUERY_KEY.FACET_LIST],
    () =>
      getFacetSortValue(
        workspaceId,
        environmentId,
        facetField,
        sortBy,
        orderBy,
        isFieldOrderingEnable
      ),
    {
      cacheTime: 0,
    }
  );

export default useGetFacetSortValue;
