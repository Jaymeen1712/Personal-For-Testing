import { useQuery } from 'react-query';

import { IAPIError, IAxiosResponse, ModelGroupList } from '../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';
import apiClient from '../../../api-client';

const groupList = async (workspaceId: string) => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: ModelGroupList[] }>
  >(`${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/content-model-groups`);

  return result.response.Data.items;
};

const useGetModelGroupList = (workspaceId: string) =>
  useQuery<ModelGroupList[], IAPIError>(
    [API_QUERY_KEY.CONTENT_MODEL_GROUP_LIST],
    () => groupList(workspaceId),
    {
      cacheTime: 0,
    }
  );

export default useGetModelGroupList;
