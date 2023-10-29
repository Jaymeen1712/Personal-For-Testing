import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAxiosResponse } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

interface IDetailsWorkspace {
  id: string;
  description: string;
  name: string;
  timezone: string;
  currency: string;
}

const workspaceDetailsDashboard = async (workspaceId: string) => {
  const response = await apiClient.get<
    string,
    IAxiosResponse<{ item: IDetailsWorkspace }>
  >(`${APIS_ROUTES.WORKSPACES}/${workspaceId}`, {
    params: { fields_to_query: 'description,name,timezone,currency' },
  });

  return response.response.Data.item;
};

const useWorkspaceDetailsDashboard = (workspaceId: string) =>
  useQuery([API_QUERY_KEY.WORKSPACE_DETAILS, workspaceId], () =>
    workspaceDetailsDashboard(workspaceId)
  );

export default useWorkspaceDetailsDashboard;
