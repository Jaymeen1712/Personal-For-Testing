import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../api-client';
import {
  IAxiosResponse,
  IListMasterTemplateEmailsResponse,
} from '../../../../../types';

const listMasterTemplateEmails = async (workspaceId: string) => {
  const response = await apiClient.get<
    string,
    IAxiosResponse<{ items: IListMasterTemplateEmailsResponse[] }>
  >(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/email-templates/master-template`,
    {
      params: {
        fields: 'name,id',
      },
    }
  );

  return response.response.Data.items;
};

const useListMasterTemplateEmails = (workspaceId: string) =>
  useQuery(
    [API_QUERY_KEY.LIST_MASTER_TEMPLATE, workspaceId],
    () => listMasterTemplateEmails(workspaceId),
    {
      cacheTime: 0,
    }
  );

export default useListMasterTemplateEmails;
