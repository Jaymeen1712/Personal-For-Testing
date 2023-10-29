import { useQuery } from 'react-query';

import { IAPIError, IAxiosResponse, PublishQueue } from '../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';

const getPublishQueue = async (
  workspaceId: string,
  contentId: string,
  contentModelDataId: string,
  versionId: string
) => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: PublishQueue[] }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/contents/${contentId}/content-model-data/${contentModelDataId}/versions/${versionId}/publish-queue`
  );
  return result.response.Data.items;
};

const useGetPublishQueue = (
  workspaceId: string,
  contentId: string,
  contentModelDataId: string,
  versionId: string
) =>
  useQuery<PublishQueue[], IAPIError>(
    [API_QUERY_KEY.PUBLISH_QUEUE],
    () =>
      getPublishQueue(workspaceId, contentId, contentModelDataId, versionId),
    {
      cacheTime: 0,
    }
  );

export default useGetPublishQueue;
