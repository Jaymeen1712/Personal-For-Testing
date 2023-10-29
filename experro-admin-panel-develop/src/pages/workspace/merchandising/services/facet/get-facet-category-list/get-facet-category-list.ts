import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAPIError, IAxiosResponse } from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

const getFacetsCategoryList = async (
  workspaceId: string,
  environmentId?: string | null
) => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{
      items: { id: string; title: string; current_version_id: string }[];
      totalCount: number;
    }>
  >(
    `${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/contents/content-data/category-list`,
    {
      params: {
        fieldsToQuery: 'title',
        environments_id: `${environmentId}`,
      },
    }
  );
  return result.response.Data;
};

const useFacetsCategoryList = (
  workspaceId: string,
  environmentId?: string | null
) =>
  useQuery<
    {
      items: { id: string; title: string; current_version_id: string }[];
      totalCount: number;
    },
    IAPIError
  >(
    [API_QUERY_KEY.FACET_CATEGORY_LIST],
    () => getFacetsCategoryList(workspaceId, environmentId),
    {
      cacheTime: 0,
    }
  );

export default useFacetsCategoryList;
