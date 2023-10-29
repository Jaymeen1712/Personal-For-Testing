import { useQuery } from 'react-query';

import apiClient from '../../../api-client';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills/enums';
import {
  IAPIError,
  IAxiosResponse,
  IWorkspaceResponse,
} from '../../../../types';

const listWorkspaces = async () => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: IWorkspaceResponse[] }>
  >(APIS_ROUTES.WORKSPACES, {
    params: {
      fields: 'description,users,created_at,modified_at,timezone,currency',
    },
  });

  return result.response.Data.items;
};

const useListWorkspaces = () =>
  useQuery<IWorkspaceResponse[], IAPIError>(
    [API_QUERY_KEY.WORKSPACE],
    listWorkspaces,
    { cacheTime: 0 }
  );

export default useListWorkspaces;
