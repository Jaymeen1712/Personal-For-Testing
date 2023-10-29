import { useQuery } from 'react-query';
import { IAPIError, IAxiosResponse } from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';
import apiClient from '../../../../../../apis/api-client';

const getMerchandisingUserPreference = async (
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

const useGetMerchandisingUserPreference = (
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
    () => getMerchandisingUserPreference(workspaceId, preferenceName, userId)
  );

export default useGetMerchandisingUserPreference;
