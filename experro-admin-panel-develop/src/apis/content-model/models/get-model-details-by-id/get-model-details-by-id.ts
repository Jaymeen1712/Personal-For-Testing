import { useQuery } from 'react-query';

import { ContentModelList, IAPIError, IAxiosResponse } from '../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';
import apiClient from '../../../api-client';

const getModelDetailsById = async (
  workspaceId: string,
  contentModelId: string,
  addNewType: string
) => {
  if (!contentModelId || addNewType === 'component')
    return {} as ContentModelList;
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ item: ContentModelList }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/contents/${contentModelId}`,
    {
      params: {
        fields:
          'name,type,created_at,template,act_as_web_page,internal_name,is_localization_enabled,group_id,description,position,is_system_created',
      },
    }
  );
  return result.response.Data.item;
};

const useGetModelDetailsById = (
  workspaceId: string,
  contentModelId: string,
  addNewType: string
) =>
  useQuery<ContentModelList, IAPIError>(
    [API_QUERY_KEY.CONTENT_MODEL_DETAILS_BY_ID, contentModelId],
    () => getModelDetailsById(workspaceId, contentModelId, addNewType),
    {
      cacheTime: 0,
    }
  );

export default useGetModelDetailsById;
