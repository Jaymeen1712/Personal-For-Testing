import { useQuery } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { IAxiosResponse, IListStopWords } from '../../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../../utills';

const listStopWords = async (
  workspaceId: string,
  page: number,
  pageSize: number,
  sortBy: string,
  orderBy: string,
  searchData: string,
  environment: string
) => {
  if (!workspaceId) return;

  const result = await apiClient.get<
    string,
    IAxiosResponse<{ items: IListStopWords[]; totalRecord: number }>
  >(`${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/stop-words`, {
    params: {
      search: `${searchData}`,
      skip: (page - 1) * pageSize,
      limit: pageSize,
      sort_by: sortBy,
      order_by: orderBy,
      environment_id: environment,
    },
  });

  return result.response.Data;
};

const useListStopWords = (
  workspaceId: string,
  page: number,
  pageSize: number,
  sortBy: string,
  orderBy: string,
  searchData: string,
  environment: string
) =>
  useQuery(
    [
      API_QUERY_KEY.LIST_STOP_WORDS,
      page,
      pageSize,
      sortBy,
      orderBy,
      searchData,
      environment,
    ],
    () =>
      listStopWords(
        workspaceId,
        page,
        pageSize,
        sortBy,
        orderBy,
        searchData,
        environment
      ),
    { cacheTime: 0 }
  );

export default useListStopWords;
