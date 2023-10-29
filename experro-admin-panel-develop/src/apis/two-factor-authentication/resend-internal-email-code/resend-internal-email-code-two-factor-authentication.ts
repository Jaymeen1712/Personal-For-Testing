import axios from 'axios';
import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';

interface IResendInternalEmailCodeTwoFactorAuthenticationResponse {
  data: {
    Data: {
      item: boolean;
    };
  };
}

const resendInternalEmailCodeTwoFactorAuthentication = async (
  isResendCode: boolean,
  sendInitialMail: boolean,
  accessToken?: string
) => {
  if (!isResendCode) return;

  const apiClient = await axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  const response = await apiClient.get<
    void,
    IResendInternalEmailCodeTwoFactorAuthenticationResponse
  >(`${APIS_ROUTES.RESEND_TWO_FACTOR_AUTHENTICATION_CODE}`, {
    params: {
      is_send_email: sendInitialMail,
    },
    headers: {
      'content-type': 'application/json',
      accesstoken: `Bearer ${accessToken}`,
    },
  });

  return response.data.Data.item;
};

const useResendInternalEmailCodeTwoFactorAuthentication = (
  isResendCode: boolean,
  sendInitialMail: boolean,
  accessToken?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.INTERNAL_RESEND_CODE,
      isResendCode,
      sendInitialMail,
      accessToken,
    ],
    () =>
      resendInternalEmailCodeTwoFactorAuthentication(
        isResendCode,
        sendInitialMail,
        accessToken
      )
  );

export default useResendInternalEmailCodeTwoFactorAuthentication;
