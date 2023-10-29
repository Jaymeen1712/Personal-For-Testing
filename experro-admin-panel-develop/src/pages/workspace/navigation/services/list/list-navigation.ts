import { useQuery } from 'react-query';
import apiClient from '../../../../../apis/api-client';
import { APIS_ROUTES, API_QUERY_KEY } from '../../../../../utills/enums';
import { IAxiosResponse, INavigationListResponse } from '../../../../../types';

const listNavigation = async (
  workspaceId: string,
  contentModelId?: string,
  filter?: string,
  userIds?: string[],
  orderBy?: string,
  sortBy?: string
) => {
  if (!contentModelId) return;
  const response = await apiClient.get<
    null,
    IAxiosResponse<INavigationListResponse>
  >(
    `${APIS_ROUTES.NAVIGATION}/${workspaceId}/menu/${contentModelId}/menu-items`,
    {
      params: {
        search: filter,
        order_by: orderBy,
        sort_by: sortBy,
        users_id: userIds?.join(','),
      },
    }
  );
  return response.response.Data.items;
};

const useListNavigation = (
  workspaceId: string,
  contentModelId?: string,
  filter?: string,
  userIds?: string[],
  orderBy?: string,
  sortBy?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.NAVIGATION_LIST,
      contentModelId,
      workspaceId,
      // filter,
      // userIds,
    ],
    () =>
      listNavigation(
        workspaceId,
        contentModelId,
        filter,
        userIds,
        orderBy,
        sortBy
      ),
    {
      cacheTime: 0,
    }
  );

export default useListNavigation;
