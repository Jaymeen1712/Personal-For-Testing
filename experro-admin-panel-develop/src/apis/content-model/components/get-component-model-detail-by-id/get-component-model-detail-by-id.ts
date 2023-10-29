import { useQuery } from 'react-query';

import { ContentModelList, IAPIError, IAxiosResponse } from '../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';
import apiClient from '../../../api-client';

const getComponentModelDetailsById = async (
  workspaceId: string,
  contentModelId: string,
  addNewType: string
) => {
  if (!contentModelId || addNewType !== 'component')
    return {} as ContentModelList;
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ item: ContentModelList }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/components/${contentModelId}`,
    {
      params: {
        fields:
          'name,created_at,is_localization_enabled,group_id,description,position',
      },
    }
  );
  return result.response.Data.item;
};

const useGetComponentModelDetailsById = (
  workspaceId: string,
  contentModelId: string,
  addNewType: string
) =>
  useQuery<ContentModelList, IAPIError>(
    [API_QUERY_KEY.COMPONENT_MODEL_DETAILS_BY_ID, contentModelId],
    () => getComponentModelDetailsById(workspaceId, contentModelId, addNewType),
    {
      cacheTime: 0,
    }
  );

export default useGetComponentModelDetailsById;
