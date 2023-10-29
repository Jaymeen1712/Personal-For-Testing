import { useQuery } from 'react-query';

import { IAPIError, IAxiosResponse, ModelGroupList } from '../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';
import apiClient from '../../../api-client';

const groupComponentList = async (workspaceId: string) => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: ModelGroupList[] }>
  >(`${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/component-groups`);
  return result.response.Data.items;
};

const useGetComponentGroupList = (workspaceId: string) =>
  useQuery<ModelGroupList[], IAPIError>(
    [API_QUERY_KEY.COMPONENT_MODEL_GROUP_LIST],
    () => groupComponentList(workspaceId),
    {
      cacheTime: 0,
    }
  );

export default useGetComponentGroupList;
