import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES, snakeToCamel } from '../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  IListContentResponse,
} from '../../../../types';
import apiClient from '../../../../apis/api-client';

const listContentModel = async (type: string, workspaceId: string) => {
  if (!workspaceId || workspaceId === 'global') return;
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: IListContentResponse[] }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}${APIS_ROUTES.PUBLIC_CONTENTS}`
  );

  response.response.Data.items.forEach((contentModel) => {
    // @ts-ignore
    contentModel.internalName = snakeToCamel(contentModel.internalName);
  });

  return response.response.Data.items;
};

const useListContentModel = (type: string, workspaceId: string) =>
  useQuery<IListContentResponse[] | undefined, IAPIError>(
    [API_QUERY_KEY.ALL_CONTENTS, type, workspaceId],
    () => listContentModel(type, workspaceId)
  );

export default useListContentModel;
