import { useQuery } from 'react-query';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';
import { IAxiosResponse } from '../../../types';

interface IDetailsWorkspace {
  id: string;
  description: string;
  name: string;
  timezone: string;
  currency: string;
}

const detailsWorkspace = async (workspaceId: string) => {
  const response = await apiClient.get<
    string,
    IAxiosResponse<{ item: IDetailsWorkspace }>
  >(`${APIS_ROUTES.WORKSPACES}/${workspaceId}`, {
    params: { fields_to_query: 'description,name,timezone,currency' },
  });

  return response.response.Data.item;
};

const useDetailsWorkspace = (workspaceId: string) =>
  useQuery([API_QUERY_KEY.WORKSPACE_DETAILS, workspaceId], () =>
    detailsWorkspace(workspaceId)
  );

export default useDetailsWorkspace;
