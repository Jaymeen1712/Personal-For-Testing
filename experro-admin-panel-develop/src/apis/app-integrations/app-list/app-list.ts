import { useQuery } from 'react-query';

import { IAppLIst, IAPIError, IAxiosResponse } from '../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';

const appList = async (
  workspaceId: string,
  selectedCategory: string,
  isAppInstalled: boolean
) => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: IAppLIst[] }>
  >(`${APIS_ROUTES.APP_INTEGRATION_ROUTE}/${workspaceId}/integrations`, {
    params: {
      activate_filter: isAppInstalled,
      category_filter: selectedCategory,
    },
  });
  return result.response.Data.items;
};

const useGetAppList = (
  workspaceId: string,
  selectedCategory: string,
  isAppInstalled: boolean
) =>
  useQuery<IAppLIst[], IAPIError>(
    [API_QUERY_KEY.APP_LIST],
    () => appList(workspaceId, selectedCategory, isAppInstalled),
    {
      cacheTime: 0,
    }
  );

export default useGetAppList;
