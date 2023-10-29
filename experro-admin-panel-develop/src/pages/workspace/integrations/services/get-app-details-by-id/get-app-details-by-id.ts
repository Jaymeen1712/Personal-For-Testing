import { useQuery } from 'react-query';

import { IAppLIst, IAPIError, IAxiosResponse } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

const getAppById = async (workspaceId: string, id: string) => {
  if (!id) return {} as IAppLIst;
  const result = await apiClient.get<null, IAxiosResponse<{ item: IAppLIst }>>(
    `${APIS_ROUTES.APP_INTEGRATION_ROUTE}/${workspaceId}/integrations/${id}`
  );
  return result.response.Data.item;
};

const useGetAppById = (workspaceId: string, id: string) =>
  useQuery<IAppLIst, IAPIError>(
    [API_QUERY_KEY.GET_APP_BY_ID],
    () => getAppById(workspaceId, id),
    {
      cacheTime: 0,
    }
  );

export default useGetAppById;
