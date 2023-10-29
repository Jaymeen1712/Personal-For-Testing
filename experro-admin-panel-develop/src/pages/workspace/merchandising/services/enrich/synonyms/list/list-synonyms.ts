import { useQuery } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { IAxiosResponse, IListSynonyms } from '../../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../../utills';

const listSynonyms = async (
  workspaceId: string,
  environment: string,
  page: number,
  pageSize: number,
  sortBy: string,
  orderBy: string,
  searchData: string,
  type?: string,
  isUserDefined?: boolean,
  isSmartSuggestion?: boolean,
  status?: string
) => {
  if (!workspaceId) return;

  const result = await apiClient.get<
    string,
    IAxiosResponse<{ items: IListSynonyms[]; totalRecord: number }>
  >(`${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/synonyms`, {
    params: {
      search: `${searchData}`,
      skip: (page - 1) * pageSize,
      limit: pageSize,
      sort_by: sortBy,
      order_by: orderBy,
      synonym_type: type,
      is_user_defined: isUserDefined,
      is_smart_suggestion: isSmartSuggestion,
      filter_status: status,
      environment_id: environment,
    },
  });

  return result.response.Data;
};

const useListSynonyms = (
  workspaceId: string,
  environment: string,
  page: number,
  pageSize: number,
  sortBy: string,
  orderBy: string,
  searchData: string,
  type?: string,
  isUserDefined?: boolean,
  isSmartSuggestion?: boolean,
  status?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.LIST_SYNONYMS,
      workspaceId,
      environment,
      page,
      pageSize,
      sortBy,
      orderBy,
      searchData,
      type,
      isUserDefined,
      isSmartSuggestion,
      status,
    ],
    () =>
      listSynonyms(
        workspaceId,
        environment,
        page,
        pageSize,
        sortBy,
        orderBy,
        searchData,
        type,
        isUserDefined,
        isSmartSuggestion,
        status
      ),
    { cacheTime: 0 }
  );

export default useListSynonyms;
