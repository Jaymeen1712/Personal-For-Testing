import { useQuery } from 'react-query';

import { ContentModelList, IAPIError, IAxiosResponse } from '../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';

const modelList = async (workspaceId: string, envId: string | null) => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: ContentModelList[] }>
  >(`${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/content-models`, {
    params: {
      fields:
        'name,type,created_at,template,act_as_web_page,internal_name,is_localization_enabled,group_id,description,template,environment_id,edge_caching',
      environment_id: envId,
    },
  });
  return result.response.Data.items;
};

const useGetModelList = (workspaceId: string, envId: string | null) =>
  useQuery<ContentModelList[], IAPIError>(
    [API_QUERY_KEY.CONTENT_MODEL_LIST],
    () => modelList(workspaceId, envId),
    {
      cacheTime: 0,
    }
  );

export default useGetModelList;
