import { useQuery } from 'react-query';

import {
  ContentModelList,
  IAPIError,
  IAxiosResponse,
} from '../../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../../utills';
import apiClient from '../../../../../../../apis/api-client';

const modelListPublicApi = async (
  workspaceId: string,
  selectedType?: string
) => {
  if (selectedType !== 'link-record') return [];
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: ContentModelList[] }>
  >(`${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/public-content-models`, {
    params: {
      act_as_web_page: true,
      fields:
        'name,type,created_at,template,act_as_web_page,internal_name,is_localization_enabled,group_id,description,template,environment_id,is_versionable',
    },
  });
  return result.response.Data.items;
};

const useGetModelListPublicApi = (workspaceId: string, selectedType?: string) =>
  useQuery<ContentModelList[], IAPIError>(
    [API_QUERY_KEY.CONTENT_MODAL_LIST_PUBLIC_API],
    () => modelListPublicApi(workspaceId, selectedType),
    {
      cacheTime: 0,
    }
  );

export default useGetModelListPublicApi;
