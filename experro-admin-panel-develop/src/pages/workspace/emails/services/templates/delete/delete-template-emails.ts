import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';

const deleteTemplateEmails = async (
  workspaceId: string,
  templateId: string
) => {
  await apiClient.delete(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/email-templates/template/${templateId}`
  );
};

const useDeleteTemplateEmails = (workspaceId: string) =>
  useMutation(
    [API_MUTATION_KEY.DELETE_TEMPLATES_EMAIL, workspaceId],
    (templateId: string) => deleteTemplateEmails(workspaceId, templateId)
  );

export default useDeleteTemplateEmails;
