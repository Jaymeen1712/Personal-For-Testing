import { useQuery } from 'react-query';

import { IAppLIst, IAPIError, IAxiosResponse } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

const appList = async (
  workspaceId: string,
  selectedCategory: string,
  isAppInstalled: boolean,
  search: string
) => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: IAppLIst[] }>
  >(`${APIS_ROUTES.APP_INTEGRATION_ROUTE}/${workspaceId}/integrations`, {
    params: {
      activate_filter: isAppInstalled,
      category_filter: selectedCategory,
      search: search,
    },
  });
  return result.response.Data.items;
};

const useGetAppList = (
  workspaceId: string,
  selectedCategory: string,
  isAppInstalled: boolean,
  search: string
) =>
  useQuery<IAppLIst[], IAPIError>(
    [API_QUERY_KEY.APP_LIST],
    () => appList(workspaceId, selectedCategory, isAppInstalled, search),
    {
      cacheTime: 0,
    }
  );

export default useGetAppList;
