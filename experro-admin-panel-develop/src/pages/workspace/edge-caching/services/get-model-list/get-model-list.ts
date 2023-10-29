import { useQuery } from 'react-query';

import {
  ContentModelList,
  IAPIError,
  IAxiosResponse,
} from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

const modelList = async (
  workspaceId: string,
  productionEnvironmentId?: string
) => {
  if (!productionEnvironmentId) return [];
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: ContentModelList[] }>
  >(`${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/contents`, {
    params: {
      fields:
        'name,type,created_at,template,act_as_web_page,internal_name,is_localization_enabled,group_id,description,template,environment_id',
      is_edge_caching: true,
      environment_id: productionEnvironmentId,
    },
  });
  return result.response.Data.items;
};

const useGetModelList = (
  workspaceId: string,
  productionEnvironmentId?: string
) =>
  useQuery<ContentModelList[], IAPIError>(
    [API_QUERY_KEY.CONTENT_MODEL_LIST, productionEnvironmentId],
    () => modelList(workspaceId, productionEnvironmentId),
    {
      cacheTime: 0,
    }
  );

export default useGetModelList;
