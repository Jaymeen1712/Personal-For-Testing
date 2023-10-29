import { useQuery } from 'react-query';
import apiClient from '../../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IContentfulStore,
} from '../../../../../../../types';
import { APIS_ROUTES, API_QUERY_KEY } from '../../../../../../../utills';

const listContentfulStore = async (workspaceId: string) => {
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: IContentfulStore[] }>
  >(`${APIS_ROUTES.CONTENTFUL_ROUTE}/${workspaceId}/contentful`, {
    params: {
      fieldsToQuery: 'id,integration_environment_id,space_id,access_token',
    },
  });
  return response.response.Data.items[0];
};

const useListContentfulStore = (workspaceId: string) =>
  useQuery<IContentfulStore, IAPIError>(
    [API_QUERY_KEY.LIST_CONTENTFUL_STORE],
    () => listContentfulStore(workspaceId),
    {
      cacheTime: 0,
    }
  );

export default useListContentfulStore;
