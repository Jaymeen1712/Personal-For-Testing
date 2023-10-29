import { useMutation } from 'react-query';
import axios from 'axios';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import { IAPIError } from '../../../types';

interface IValidateInternalUsingEmailRequest {
  emailCode: string;
  accessToken: string;
}

interface IValidateInternalEmailCodeTwoFactorAuthenticationResponse {
  data: {
    Data: {
      item: boolean;
    };
  };
}

const validateInternalEmailCodeTwoFactorAuthentication = async (
  values: IValidateInternalUsingEmailRequest
) => {
  const apiClient = await axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  const response = await apiClient.post<
    IValidateInternalUsingEmailRequest,
    IValidateInternalEmailCodeTwoFactorAuthenticationResponse
  >(
    `${APIS_ROUTES.VERIFY_EMAIL_CODE}`,
    {
      email_code: values.emailCode,
    },
    {
      headers: {
        'content-type': 'application/json',
        accesstoken: `Bearer ${values.accessToken}`,
      },
    }
  );

  return response.data.Data.item;
};

const useValidateInternalEmailCodeTwoFactorAuthentication = () =>
  useMutation<boolean, IAPIError, IValidateInternalUsingEmailRequest>(
    [API_MUTATION_KEY.VALIDATE_INTERNAL_EMAIL_CODE],
    (values) => validateInternalEmailCodeTwoFactorAuthentication(values)
  );

export default useValidateInternalEmailCodeTwoFactorAuthentication;
