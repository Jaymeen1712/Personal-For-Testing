import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';
import apiClient from '../../../api-client';
import {
  IAxiosResponse,
  IListEnvironments,
  IListTemplateEmailsResponse,
} from '../../../../types';

const listTemplatesEmails = async (
  workspaceId: string,
  masterTemplateId?: string
) => {
  if (!masterTemplateId) return;

  const response = await apiClient.get<
    string,
    IAxiosResponse<{ items: IListTemplateEmailsResponse[] }>
  >(`${APIS_ROUTES.WORKSPACES}/${workspaceId}/email-templates/template`, {
    params: {
      fields:
        'name, html_content, environment_ids,is_default,subject,is_active',
      master_template_id: masterTemplateId,
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
        const selectedEnvironment = environments.response.Data?.filter(
          (environmentInfo) => environmentInfo.id === environment
        );
        tempEnvironments.push(selectedEnvironment[0].title);
        return true;
      });
      template.environments = tempEnvironments;
    } else {
      template.environments = [];
    }

    return true;
  });

  return response.response.Data.items;
};

const useListTemplatesEmails = (
  workspaceId: string,
  masterTemplateId?: string
) =>
  useQuery(
    [API_QUERY_KEY.LIST_TEMPLATES, workspaceId, masterTemplateId],
    () => listTemplatesEmails(workspaceId, masterTemplateId),
    {
      cacheTime: 0,
    }
  );

export default useListTemplatesEmails;
