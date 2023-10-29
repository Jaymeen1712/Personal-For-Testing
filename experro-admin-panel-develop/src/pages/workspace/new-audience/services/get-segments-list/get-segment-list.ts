import { useQuery } from 'react-query';
import { IAPIError, IAxiosResponse, ISegmentList } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

const getSegmentsList = async (workspaceId: string, environmentId: string) => {
  if (!workspaceId || !environmentId) return { items: [] };

  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: ISegmentList[] }>
  >(`${APIS_ROUTES.AUDIENCE_SERVICE}/${workspaceId}/segments`, {
    params: {
      environmentId: environmentId,
    },
  });

  return response.response.Data;
};

const useGetSegmentsList = (workspaceId: string, environmentId: string) =>
  useQuery<{ items: ISegmentList[] }, IAPIError>(
    [API_QUERY_KEY.GET_SEGMENTS_LIST, environmentId],
    () => getSegmentsList(workspaceId, environmentId),
    {
      cacheTime: 0,
    }
  );

export default useGetSegmentsList;
