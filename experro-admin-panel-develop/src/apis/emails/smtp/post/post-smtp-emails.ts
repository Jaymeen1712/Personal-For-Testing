import { useMutation } from 'react-query';

import {
  IAPIError,
  IAxiosResponse,
  IGetSmtpEmailsResponse,
} from '../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills';
import apiClient from '../../../api-client';
import shapeCollection from '../../../../utills/convert-request-response';

interface IPostSmtpEmailsResponse {
  id: string;
}

const postSmtpEmails = async (
  workspaceId: string,
  values: IGetSmtpEmailsResponse
) => {
  const response = await apiClient.post<
    IGetSmtpEmailsResponse,
    IAxiosResponse<{ item: IPostSmtpEmailsResponse }>
  >(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/email-templates/smtp`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return response.response.Data.item;
};

const usePostSmtpEmails = (workspaceId: string) =>
  useMutation<IPostSmtpEmailsResponse, IAPIError, IGetSmtpEmailsResponse>(
    [API_MUTATION_KEY.CREATE_SMTP_EMAIL],
    (values) => postSmtpEmails(workspaceId, values)
  );

export default usePostSmtpEmails;
