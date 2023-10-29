import { useQuery } from 'react-query';

import { IAPIError, IAxiosResponse } from '../../../../../types';
import { API_QUERY_KEY } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

interface cachingResponse {
  contentModels: {
    id: string;
    edgeCaching: boolean;
  }[];
  edgeCaching: boolean;
  id: string;
  edgeCacheTime: string;
}

const getCachingDetails = async (workspaceId: string) => {
  const result = await apiClient.get<null, IAxiosResponse<cachingResponse>>(
    `/setting-service/v1/workspaces/${workspaceId}/edge-caching`
  );
  return result.response.Data;
};

const useGetCachingDetails = (workspaceId: string) =>
  useQuery<cachingResponse, IAPIError>(
    [API_QUERY_KEY.GET_CACHE_DETAILS],
    () => getCachingDetails(workspaceId),
    {
      cacheTime: 0,
    }
  );

export default useGetCachingDetails;
