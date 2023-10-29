import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAPIError, IAxiosResponse, IThemeStatus } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const getThemeStatus = async (
  workspaceId?: string,
  environmentIds?: string[]
) => {
  if (!workspaceId || environmentIds?.length === 0) return;

  const result = await apiClient.get<null, IAxiosResponse<IThemeStatus>>(
    `${APIS_ROUTES.THEME_SERVICE}/${workspaceId}/theme-publishing-status/get-theme-publishing-status`,
    {
      params: {
        environmentIds: environmentIds?.toString(),
      },
    }
  );

  return result.response.Data;
};

const useGetThemeStatus = (workspaceId?: string, environmentIds?: string[]) =>
  useQuery<IThemeStatus | undefined, IAPIError>(
    [API_QUERY_KEY.GET_THEME_STATUS, workspaceId, environmentIds],
    () => getThemeStatus(workspaceId, environmentIds),
    {
      cacheTime: 0,
    }
  );

export default useGetThemeStatus;
