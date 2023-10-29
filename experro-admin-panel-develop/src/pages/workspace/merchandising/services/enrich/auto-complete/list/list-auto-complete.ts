import { useQuery } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { IAxiosResponse, IListAutoComplete } from '../../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../../utills';

const listAutoComplete = async (
  workspaceId: string,
  page: number,
  pageSize: number,
  sortBy: string,
  orderBy: string,
  environment: string,
  type: string
) => {
  if (!workspaceId) return;

  const result = await apiClient.get<
    string,
    IAxiosResponse<{ items: IListAutoComplete[]; totalCount: number }>
  >(`${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/auto-suggesters`, {
    params: {
      fieldsToQuery:
        'search_term,id,type,modified_by,modified_on,created_by,created_at',
      skip: (page - 1) * pageSize,
      limit: pageSize,
      sort_by: sortBy,
      order_by: orderBy,
      environment_id: environment,
      type: type,
    },
  });

  return result.response.Data;
};

const useListAutoComplete = (
  workspaceId: string,
  page: number,
  pageSize: number,
  sortBy: string,
  orderBy: string,
  environment: string,
  type: string
) =>
  useQuery(
    [
      API_QUERY_KEY.LIST_AUTO_COMPLETE,
      page,
      pageSize,
      sortBy,
      orderBy,
      environment,
      type,
    ],
    () =>
      listAutoComplete(
        workspaceId,
        page,
        pageSize,
        sortBy,
        orderBy,
        environment,
        type
      ),
    { cacheTime: 0 }
  );

export default useListAutoComplete;
