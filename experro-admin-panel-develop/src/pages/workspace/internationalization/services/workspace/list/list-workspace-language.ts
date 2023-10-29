import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAPIError, IAxiosResponse, ILanguage } from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

const listWorkspaceLanguage = async (workspaceId: string) => {
  if (!workspaceId || workspaceId === 'global') return [];

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: ILanguage[] }>
  >(`${APIS_ROUTES.WORKSPACE_LANGUAGES}/${workspaceId}/languages`, {
    params: { fields: 'position' },
  });

  const selectedLanguages = result.response.Data.items;

  //Here we are provided index for the sorting purpose.
  return selectedLanguages.map((item, index) => ({
    ...item,
    index: index + 1,
  }));
};

const useListWorkspaceLanguage = (workspaceId: string) =>
  useQuery<ILanguage[], IAPIError>(
    [API_QUERY_KEY.WORKSPACE_LANGUAGES, workspaceId],
    () => listWorkspaceLanguage(workspaceId),
    { cacheTime: 0 }
  );

export default useListWorkspaceLanguage;
