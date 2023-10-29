import { useQuery } from 'react-query';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';
import { IAxiosResponse } from '../../../types';

const resendEmailCodeTwoFactorAuthentication = async (
  isResendCode: boolean,
  sendInitialMail: boolean
) => {
  if (!isResendCode) return;

  const response = await apiClient.get<void, IAxiosResponse<{ item: boolean }>>(
    `${APIS_ROUTES.RESEND_TWO_FACTOR_AUTHENTICATION_CODE}`,
    {
      params: {
        is_send_email: sendInitialMail,
      },
    }
  );

  return response.response.Data.item;
};

const useResendEmailCodeTwoFactorAuthentication = (
  isResendCode: boolean,
  sendInitialMail: boolean
) =>
  useQuery([API_QUERY_KEY.RESEND_CODE, isResendCode, sendInitialMail], () =>
    resendEmailCodeTwoFactorAuthentication(isResendCode, sendInitialMail)
  );

export default useResendEmailCodeTwoFactorAuthentication;
