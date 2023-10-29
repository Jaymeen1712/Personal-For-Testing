import { useQuery } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { IAxiosResponse, IListPhrases } from '../../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../../utills';

const listPhrases = async (
  workspaceId: string,
  environmentId: string,
  page: number,
  pageSize: number,
  sortBy: string,
  orderBy: string,
  searchData: string,
  count?: number,
  isUserDefined?: boolean,
  isSmartSuggestion?: boolean,
  status?: string,
  startConfidence?: number,
  endConfidence?: number
) => {
  if (!workspaceId) return;
  // eslint-disable-next-line
  const result = await apiClient.get<
    string,
    IAxiosResponse<{ items: IListPhrases[]; totalRecord: number }>
  >(`${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/phrases`, {
    params: {
      search: `${searchData}`,
      skip: (page - 1) * pageSize,
      limit: pageSize,
      sort_by: sortBy,
      order_by: orderBy,
      filter_word_count: count,
      environment_id: environmentId,
      is_user_defined: isUserDefined,
      is_smart_suggestion: isSmartSuggestion,
      filter_status: status,
      filter_confidence_min:
        startConfidence && startConfidence > 0 ? startConfidence : '',
      filter_confidence_max:
        endConfidence && endConfidence < 100 ? endConfidence : '',
    },
  });

  return result.response.Data;
};

const useListPhrases = (
  workspaceId: string,
  environmentId: string,
  page: number,
  pageSize: number,
  sortBy: string,
  orderBy: string,
  searchData: string,
  count?: number,
  isUserDefined?: boolean,
  isSmartSuggestion?: boolean,
  status?: string,
  startConfidence?: number,
  endConfidence?: number
) =>
  useQuery(
    [
      API_QUERY_KEY.LIST_PHRASES,
      workspaceId,
      environmentId,
      page,
      pageSize,
      sortBy,
      orderBy,
      searchData,
      count,
      isUserDefined,
      isSmartSuggestion,
      status,
      // startConfidence,
    ],
    () =>
      listPhrases(
        workspaceId,
        environmentId,
        page,
        pageSize,
        sortBy,
        orderBy,
        searchData,
        count,
        isUserDefined,
        isSmartSuggestion,
        status,
        startConfidence,
        endConfidence
      ),
    { cacheTime: 0 }
  );

export default useListPhrases;
