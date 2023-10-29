import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IMenuNameResponse,
} from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const getContentModelId = async (workspaceId?: string) => {
  if (!workspaceId) return;

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ item: IMenuNameResponse }>
  >(`${APIS_ROUTES.NAVIGATION}/${workspaceId}/menu-by-name/cms_menus`, {
    params: {
      fieldsToQuery: 'name,id',
    },
  });

  return result.response.Data.item;
};

const useGetContentModelId = (workspaceId?: string) =>
  useQuery<IMenuNameResponse | undefined, IAPIError>(
    [API_QUERY_KEY.GET_CONTENT_MODEL_ID, workspaceId],
    () => getContentModelId(workspaceId)
  );

export default useGetContentModelId;
