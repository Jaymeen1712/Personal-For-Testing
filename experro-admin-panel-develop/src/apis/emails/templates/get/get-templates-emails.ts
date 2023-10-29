import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';
import apiClient from '../../../api-client';
import {
  IAxiosResponse,
  IGetTemplateEmailResponse,
  IListMasterTemplateEmailsResponse,
} from '../../../../types';

const getTemplatesEmails = async (workspaceId: string, templateId: string) => {
  const response = await apiClient.get<
    string,
    IAxiosResponse<{ item: IGetTemplateEmailResponse }>
  >(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/email-templates/template/${templateId}`,
    {
      params: {
        fields:
          'master_template_id, name, html_content, environment_ids,subject',
      },
    }
  );

  const masterTemplates = await apiClient.get<
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

  const masterTemplate = masterTemplates.response.Data.items.find(
    (masterTemplate) =>
      masterTemplate.id === response.response.Data.item.masterTemplateId
  );

  if (masterTemplate) {
    response.response.Data.item.masterTemplateName = masterTemplate.name;
  } else {
    response.response.Data.item.masterTemplateName = '';
  }

  if (response.response.Data.item.environmentIds === null) {
    response.response.Data.item.environmentIds = [];
  }

  return response.response.Data.item;
};

const useGetTemplatesEmails = (workspaceId: string, templateId: string) =>
  useQuery(
    [API_QUERY_KEY.GET_TEMPLATE, workspaceId, templateId],
    () => getTemplatesEmails(workspaceId, templateId),
    {
      cacheTime: 0,
    }
  );

export default useGetTemplatesEmails;
