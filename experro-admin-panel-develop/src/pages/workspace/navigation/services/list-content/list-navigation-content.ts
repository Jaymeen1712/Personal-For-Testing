import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  IListContentResponse,
} from '../../../../../types';
import apiClient from '../../../../../apis/api-client';

const listNavigationContent = async (
  type: string,
  workspaceId: string,
  actAsWebPage?: boolean
) => {
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: IListContentResponse[] }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}${APIS_ROUTES.PUBLIC_CONTENT_MODELS}`,
    {
      params: {
        fields: 'name,type,description,act_as_web_page,internal_name',
        type: type,
        act_as_web_page: actAsWebPage,
      },
    }
  );
  return response.response.Data.items;
};

const useListNavigationContent = (
  type: string,
  workspaceId: string,
  actAsWebPage?: boolean
) =>
  useQuery<IListContentResponse[] | undefined, IAPIError>(
    [API_QUERY_KEY.NAVIGATION_CONTENTS, type, workspaceId],
    () => listNavigationContent(type, workspaceId, actAsWebPage),
    {
      cacheTime: 0,
    }
  );

export default useListNavigationContent;
