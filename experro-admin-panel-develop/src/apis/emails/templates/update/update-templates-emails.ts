import { useMutation } from 'react-query';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  ICloneTemplateEmailsResponse,
  ICreateUpdateTemplatesEmailsUpdate,
} from '../../../../types';
import apiClient from '../../../api-client';
import shapeCollection from '../../../../utills/convert-request-response';

const updateTemplatesEmails = async (
  workspaceId: string,
  templateId: string,
  values: ICreateUpdateTemplatesEmailsUpdate
) => {
  const response = await apiClient.put<
    ICreateUpdateTemplatesEmailsUpdate,
    IAxiosResponse<{ item: ICloneTemplateEmailsResponse }>
  >(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/email-templates/template/${templateId}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return response.response.Data.item;
};

const useUpdateTemplatesEmails = (workspaceId: string, templateId: string) =>
  useMutation<
    ICloneTemplateEmailsResponse,
    IAPIError,
    ICreateUpdateTemplatesEmailsUpdate
  >(
    [API_MUTATION_KEY.UPDATE_TEMPLATE_EMAIL, workspaceId, templateId],
    (values) => updateTemplatesEmails(workspaceId, templateId, values)
  );

export default useUpdateTemplatesEmails;
