import { useQuery } from 'react-query';

import { ContentModelList, IAPIError, IAxiosResponse } from '../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';
import apiClient from '../../../api-client';

const componentModelList = async (workspaceId: string) => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: ContentModelList[] }>
  >(`${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/components`, {
    params: {
      fields:
        'name,created_at,is_localization_enabled,group_id,description,id',
    },
  });
  return result.response.Data.items;
};

const useGetComponentModelList = (workspaceId: string) =>
  useQuery<ContentModelList[], IAPIError>(
    [API_QUERY_KEY.COMPONENT_MODEL_LIST],
    () => componentModelList(workspaceId),
    {
      cacheTime: 0,
    }
  );

export default useGetComponentModelList;
