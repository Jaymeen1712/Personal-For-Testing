import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAPIError, IAxiosResponse } from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import shapeCollection from '../../../../../utills/convert-request-response';

interface IValidateUsingEmailRequest {
  emailCode: string;
}

const validateEmailCodeTwoFactorAuthentication = async (
  values: IValidateUsingEmailRequest
) => {
  const response = await apiClient.post<
    IValidateUsingEmailRequest,
    IAxiosResponse<{ item: boolean }>
  >(
    `${APIS_ROUTES.VERIFY_EMAIL_CODE}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return response.response.Data.item;
};

const useValidateEmailCodeTwoFactorAuthentication = () =>
  useMutation<boolean, IAPIError, IValidateUsingEmailRequest>(
    [API_MUTATION_KEY.VALIDATE_EMAIL_CODE],
    (values) => validateEmailCodeTwoFactorAuthentication(values)
  );

export default useValidateEmailCodeTwoFactorAuthentication;
