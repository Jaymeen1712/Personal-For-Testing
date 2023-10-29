import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills';
import { IAPIError, IAxiosResponse } from '../../../../types';
import apiClient from '../../../api-client';

interface IPatchTemplateRequest {
  id: string;
  isActive: boolean;
}

const patchTemplateEmails = async (
  workspaceId: string,
  values: IPatchTemplateRequest
) => {
  const response = await apiClient.patch<
    IPatchTemplateRequest,
    IAxiosResponse<{ item: boolean }>
  >(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/email-templates/template/${values.id}/active`,
    {
      is_active: values.isActive,
    }
  );

  return response.response.Data.item;
};

const usePatchTemplateEmails = (workspaceId: string) =>
  useMutation<boolean, IAPIError, IPatchTemplateRequest>(
    [API_MUTATION_KEY.PATCH_TEMPLATE_EMAIL],
    (status) => patchTemplateEmails(workspaceId, status)
  );

export default usePatchTemplateEmails;
