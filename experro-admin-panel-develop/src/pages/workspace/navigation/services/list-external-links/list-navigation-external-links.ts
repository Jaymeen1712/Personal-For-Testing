import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  IListContentResponse,
} from '../../../../../types';
import apiClient from '../../../../../apis/api-client';

const listNavigationCustomLinks = async (workspaceId: string) => {
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ item: IListContentResponse }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/contents/content-model-name/custom_links`
  );
  return response.response.Data.item;
};

const useListNavigationCustomLinks = (workspaceId: string) =>
  useQuery<IListContentResponse, IAPIError>(
    [API_QUERY_KEY.NAVIGATION_EXTERNAL_LINK_CONTENT, workspaceId],
    () => listNavigationCustomLinks(workspaceId)
  );

export default useListNavigationCustomLinks;
