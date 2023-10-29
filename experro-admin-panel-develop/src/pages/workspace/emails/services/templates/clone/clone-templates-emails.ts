import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  ICloneTemplateEmailsRequest,
  ICloneTemplateEmailsResponse,
} from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import shapeCollection from '../../../../../../utills/convert-request-response';

const cloneTemplateEmails = async (
  workspaceId: string,
  values: ICloneTemplateEmailsRequest
) => {
  const response = await apiClient.post<
    ICloneTemplateEmailsRequest,
    IAxiosResponse<{ item: ICloneTemplateEmailsResponse }>
  >(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/email-templates/template`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return response.response.Data.item;
};

const useCloneTemplatesEmails = (workspaceId: string) =>
  useMutation<
    ICloneTemplateEmailsResponse,
    IAPIError,
    ICloneTemplateEmailsRequest
  >([API_MUTATION_KEY.CLONE_TEMPLATE, workspaceId], (values) =>
    cloneTemplateEmails(workspaceId, values)
  );

export default useCloneTemplatesEmails;
