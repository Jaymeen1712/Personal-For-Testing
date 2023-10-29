import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { I301Redirect, IAxiosResponse } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const list301Redirects = async (
  page: number,
  pageSize: number,
  // columnSortOrder: { sortBy: string; orderBy: string },
  workspaceId?: string,
  filter?: string
) => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: I301Redirect[]; totalCount: number }>
  >(`${APIS_ROUTES.WORKSPACES}/${workspaceId}/redirects`, {
    params: {
      fields: 'old_url,new_url,created_by,modified_at,id',
      search: filter,
      skip: (page - 1) * pageSize,
      limit: pageSize,
      // sort_by: columnSortOrder.sortBy,
      // order_by: columnSortOrder.orderBy,
    },
  });

  return result.response.Data;
};

const useList301Redirects = (
  page: number,
  pageSize: number,
  // columnSortOrder: { sortBy: string; orderBy: string },
  workspaceId?: string,
  filter?: string
) =>
  useQuery(
    [API_QUERY_KEY.LIST_301_REDIRECTS, workspaceId, filter, page, pageSize],
    () => list301Redirects(page, pageSize, workspaceId, filter),
    {
      cacheTime: 0,
      keepPreviousData: true,
    }
  );

export default useList301Redirects;
