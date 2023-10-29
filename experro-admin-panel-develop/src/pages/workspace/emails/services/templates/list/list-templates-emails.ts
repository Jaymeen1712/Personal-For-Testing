import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import {
  IAxiosResponse,
  IListEnvironments,
  IListTemplateEmailsResponse,
} from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

const listTemplatesEmails = async (
  workspaceId: string,
  page: number,
  pageSize: number,
  masterTemplateId?: string
) => {
  if (!masterTemplateId) return;

  const response = await apiClient.get<
    string,
    IAxiosResponse<{ totalCount: number; items: IListTemplateEmailsResponse[] }>
  >(`${APIS_ROUTES.WORKSPACES}/${workspaceId}/email-templates/template`, {
    params: {
      fields:
        'name, html_content, environment_ids,is_default,subject,is_active',
      master_template_id: masterTemplateId,
      skip: (page - 1) * pageSize,
      limit: pageSize,
    },
  });

  const environments = await apiClient.get<
    null,
    IAxiosResponse<IListEnvironments[]>
  >(`${APIS_ROUTES.ENVIRONMENT_SERVICE}/${workspaceId}/environments`);

  response.response.Data.items.map((template) => {
    const tempEnvironments: string[] = [];
    if (
      template.environmentIds &&
      template.environmentIds.length > 0 &&
      environments.response.Data.length > 0
    ) {
      template.environmentIds.map((environment) => {
        const selectedEnvironment = environments.response.Data?.find(
          (environmentInfo) => environmentInfo.id === environment
        );
        if (selectedEnvironment) {
          tempEnvironments.push(selectedEnvironment.title);
        }

        return true;
      });
      template.environments = tempEnvironments;
    } else {
      template.environments = [];
    }

    return true;
  });

  return {
    items: response.response.Data.items,
    totalCount: response.response.Data.totalCount,
  };
};

const useListTemplatesEmails = (
  workspaceId: string,
  page: number,
  pageSize: number,
  masterTemplateId?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.LIST_TEMPLATES,
      workspaceId,
      masterTemplateId,
      page,
      pageSize,
    ],
    () => listTemplatesEmails(workspaceId, page, pageSize, masterTemplateId),
    {
      cacheTime: 0,
    }
  );

export default useListTemplatesEmails;
