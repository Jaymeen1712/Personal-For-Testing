import { useQuery } from 'react-query';

import { IAPIError, IAxiosResponse, PublishQueue } from '../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';

const getVersionPublishQueue = async (
  workspaceId: string,
  contentId: string,
  contentModelDataId: string
) => {
  if (!contentModelDataId) return [];
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: PublishQueue[] }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/contents/${contentId}/content-model-data/${contentModelDataId}/versions-schedule-publish`
  );
  return result.response.Data.items;
};

const useGetVersionPublishQueue = (
  workspaceId: string,
  contentId: string,
  contentModelDataId: string
) =>
  useQuery<PublishQueue[], IAPIError>(
    [API_QUERY_KEY.VERSION_PUBLISH_QUEUE],
    () => getVersionPublishQueue(workspaceId, contentId, contentModelDataId),
    {
      cacheTime: 0,
    }
  );

export default useGetVersionPublishQueue;
