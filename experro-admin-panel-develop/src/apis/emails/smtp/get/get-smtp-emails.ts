import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';
import apiClient from '../../../api-client';
import { IAxiosResponse, IGetSmtpEmailsResponse } from '../../../../types';

const getSmtpEmails = async (workspaceId: string) => {
  const response = await apiClient.get<
    string,
    IAxiosResponse<{ item: IGetSmtpEmailsResponse }>
  >(`${APIS_ROUTES.WORKSPACES}/${workspaceId}/email-templates/smtp`, {
    params: {
      fields:
        'is_smtp_enable, from_name, from_email, smtp_host, smtp_port, is_authentication_enable, encryption_type, smtp_username, smtp_password',
    },
  });

  return response.response.Data.item;
};

const useGetSmtpEmails = (workspaceId: string) =>
  useQuery(
    [API_QUERY_KEY.GET_SMTP_EMAILS, workspaceId],
    () => getSmtpEmails(workspaceId),
    {
      cacheTime: 0,
    }
  );

export default useGetSmtpEmails;
