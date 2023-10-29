import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { FacetList, IAPIError, IAxiosResponse } from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

const getFacetList = async (
  workspaceId: string,
  searchData: string,
  environmentId?: string | null,
  sortBy?: string,
  orderBy?: string
) => {
  if (environmentId?.length === 0) return [];
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: FacetList[] }>
  >(`${APIS_ROUTES.ECOMMERCE_SERVICE}/${workspaceId}/facets`, {
    params: {
      environmentId: environmentId,
      categoryName: searchData,
      sort_by: sortBy,
      order_by: orderBy,
    },
  });
  return result.response.Data.items;
};

const useFacetRecordList = (
  workspaceId: string,
  searchData: string,
  environmentId?: string | null,
  sortBy?: string,
  orderBy?: string
) =>
  useQuery<FacetList[], IAPIError>(
    [API_QUERY_KEY.FACET_LIST, environmentId, sortBy, orderBy, searchData],
    () => getFacetList(workspaceId, searchData, environmentId, sortBy, orderBy),
    {
      cacheTime: 0,
    }
  );

export default useFacetRecordList;
