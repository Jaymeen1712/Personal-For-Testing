import { useQuery } from 'react-query';

import { IAPIError, IAxiosResponse } from '../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';

const getUserPreference = async (workspaceId: string, userID?: string) => {
  if (!userID) return [];

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: { preferenceValue: string[]; id: string }[] }>
  >(`${APIS_ROUTES.USER_PREFERENCE}/${workspaceId}/preferences`, {
    params: { user_id: `${userID}`, preference_name: 'record-list' },
  });

  return result.response.Data.items;
};

const useUserPreference = (
  workspaceId: string,
  contentModalId: string,
  userID?: string
) =>
  useQuery<{ preferenceValue: string[]; id: string }[], IAPIError>(
    [API_QUERY_KEY.GET_USER_PREFERENCE, contentModalId],
    () => getUserPreference(workspaceId, userID),
    {
      cacheTime: 0,
    }
  );

export default useUserPreference;
