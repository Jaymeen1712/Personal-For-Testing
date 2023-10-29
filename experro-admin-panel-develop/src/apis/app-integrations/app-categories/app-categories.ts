import { useQuery } from 'react-query';

import { IAppLIst, IAPIError, IAxiosResponse } from '../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';

const appCategories = async (workspaceId: string) => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: IAppLIst[] }>
  >(
    `${APIS_ROUTES.APP_INTEGRATION_ROUTE}/${workspaceId}/integrations/categories`
  );
  return result.response.Data.items;
};

const useGetAppCategories = (workspaceId: string) =>
  useQuery<IAppLIst[], IAPIError>(
    [API_QUERY_KEY.APP_CATEGORY_LIST],
    () => appCategories(workspaceId),
    {
      cacheTime: 0,
    }
  );

export default useGetAppCategories;
