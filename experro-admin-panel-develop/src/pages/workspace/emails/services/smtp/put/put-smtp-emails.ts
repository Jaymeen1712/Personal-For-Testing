import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAPIError, IGetSmtpEmailsResponse } from '../../../../../../types';
import shapeCollection from '../../../../../../utills/convert-request-response';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';

const putSmtpEmails = async (
  workspaceId: string,
  values: IGetSmtpEmailsResponse
) => {
  await apiClient.put(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/email-templates/smtp`,
    shapeCollection(values, false, 'camelToSnackCase')
  );
};

const usePutSmtpEmails = (workspaceId: string) =>
  useMutation<void, IAPIError, IGetSmtpEmailsResponse>(
    [API_MUTATION_KEY.UPDATE_SMTP_EMAIL],
    (values) => putSmtpEmails(workspaceId, values)
  );

export default usePutSmtpEmails;
