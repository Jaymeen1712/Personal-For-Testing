import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAPIError, IAxiosResponse } from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import shapeCollection from '../../../../../../utills/convert-request-response';

interface ISendTestEmailRequest {
  email: string;
  tenantId: string;
}

const sendTestEmailTemplates = async (
  workspaceId: string,
  values: ISendTestEmailRequest
) => {
  const response = await apiClient.post<
    ISendTestEmailRequest,
    IAxiosResponse<{ item: boolean }>
  >(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/email-templates/send-email`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return response.response.Data.item;
};

const useSendTestEmailTemplates = (workspaceId: string) =>
  useMutation<boolean, IAPIError, ISendTestEmailRequest>(
    [API_MUTATION_KEY.SEND_TEST_EMAIL, workspaceId],
    (values) => sendTestEmailTemplates(workspaceId, values)
  );

export default useSendTestEmailTemplates;
