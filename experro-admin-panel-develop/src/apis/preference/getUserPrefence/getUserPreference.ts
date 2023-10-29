import { useQuery } from 'react-query';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';
import { IAPIError, IAxiosResponse } from '../../../types';

const getUserPreference = async (
  workspaceId: string,
  preferenceName: string,
  userId?: string
) => {
  if (!userId) return [];

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: { preferenceValue: string[]; id: string }[] }>
  >(`${APIS_ROUTES.USER_PREFERENCE}/${workspaceId}/preferences`, {
    params: { user_id: `${userId}`, preference_name: preferenceName },
  });

  return result.response.Data.items;
};

const useGetUserPreference = (
  workspaceId: string,
  preferenceName: string,
  userId?: string
) =>
  useQuery<{ preferenceValue: string[]; id: string }[], IAPIError>(
    [
      API_QUERY_KEY.GET_USER_PREFERENCE_PUBLISH_QUEUE,
      workspaceId,
      preferenceName,
    ],
    () => getUserPreference(workspaceId, preferenceName, userId)
  );

export default useGetUserPreference;
