import { useQuery } from 'react-query';

import { IAppLIst, IAPIError, IAxiosResponse } from '../../../types';
import { API_QUERY_KEY } from '../../../utills';
import apiClient from '../../api-client';

const getAppById = async (workspaceId: string, id: string) => {
  if (!id) return {} as IAppLIst;
  const result = await apiClient.get<null, IAxiosResponse<{ item: IAppLIst }>>(
    `/contentful-service/v1/workspaces/${workspaceId}/integrations/${id}`
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
