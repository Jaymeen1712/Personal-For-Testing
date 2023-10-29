import { useQuery } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { IAxiosResponse, IListSpellCheck } from '../../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../../utills';

const listSpellCheck = async (
  workspaceId: string,
  page: number,
  pageSize: number,
  sortBy: string,
  orderBy: string,
  environment: string,
  searchData: string,
  isUserDefined?: boolean,
  isSmartSuggestion?: boolean,
  status?: string
) => {
  if (!workspaceId) return;

  const result = await apiClient.get<
    string,
    IAxiosResponse<{ items: IListSpellCheck[]; totalRecord: number }>
  >(`${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/spell-check`, {
    params: {
      search: `${searchData}`,
      skip: (page - 1) * pageSize,
      limit: pageSize,
      sort_by: sortBy,
      order_by: orderBy,
      is_user_defined: isUserDefined,
      is_smart_suggestion: isSmartSuggestion,
      filter_status: status,
      environment_id: environment,
    },
  });

  return result.response.Data;
};

const useListSpellCheck = (
  workspaceId: string,
  page: number,
  pageSize: number,
  sortBy: string,
  orderBy: string,
  environment: string,
  searchData: string,
  isUserDefined?: boolean,
  isSmartSuggestion?: boolean,
  status?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.LIST_SPELL_CHECK,
      workspaceId,
      page,
      pageSize,
      sortBy,
      orderBy,
      environment,
      searchData,
      isUserDefined,
      isSmartSuggestion,
      status,
    ],
    () =>
      listSpellCheck(
        workspaceId,
        page,
        pageSize,
        sortBy,
        orderBy,
        environment,
        searchData,
        isUserDefined,
        isSmartSuggestion,
        status
      ),
    { cacheTime: 0 }
  );

export default useListSpellCheck;
