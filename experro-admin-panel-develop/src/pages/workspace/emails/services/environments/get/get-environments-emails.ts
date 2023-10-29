import { useQuery } from 'react-query';

import {
  IAPIError,
  IAxiosResponse,
  IListEnvironments,
} from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';
import apiClient from '../../../../../../apis/api-client';

const getEnvironmentsEmails = async (workspaceId: string) => {
  if (!workspaceId) return [];

  const result = await apiClient.get<null, IAxiosResponse<IListEnvironments[]>>(
    `${APIS_ROUTES.ENVIRONMENT_SERVICE}/${workspaceId}/environments`
  );

  return result.response.Data;
};

const useGetEnvironmentsEmails = (workspaceId: string) =>
  useQuery<IListEnvironments[], IAPIError>(
    [API_QUERY_KEY.ENVIRONMENT_LIST],
    () => getEnvironmentsEmails(workspaceId)
  );

export default useGetEnvironmentsEmails;
