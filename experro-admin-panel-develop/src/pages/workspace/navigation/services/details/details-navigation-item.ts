import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  INavigationDetails,
} from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const detailsNavigation = async (
  workspaceId: string,
  menuId: string,
  contentModelId?: string
) => {
  if (!workspaceId || !menuId || !contentModelId) return;

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ item: INavigationDetails }>
  >(
    `${APIS_ROUTES.NAVIGATION}/${workspaceId}/menu/${contentModelId}/menu-items/${menuId}`
  );

  return result.response.Data.item;
};

const useDetailsNavigation = (
  workspaceId: string,
  menuId: string,
  contentModelId?: string
) =>
  useQuery<INavigationDetails | undefined, IAPIError>(
    [API_QUERY_KEY.NAVIGATION_DETAILS, workspaceId, menuId, contentModelId],
    () => detailsNavigation(workspaceId, menuId, contentModelId),
    { cacheTime: 0 }
  );

export default useDetailsNavigation;
