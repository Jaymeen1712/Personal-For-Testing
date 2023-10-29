import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAPIError, IAxiosResponse } from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import shapeCollection from '../../../../../utills/convert-request-response';

interface IValidateUsingAuthAppRequest {
  authAppCode?: string;
}

const validateAuthAppCodeTwoFactorAuthentication = async (
  values: IValidateUsingAuthAppRequest
) => {
  const response = await apiClient.post<
    IValidateUsingAuthAppRequest,
    IAxiosResponse<{ item: boolean }>
  >(
    `${APIS_ROUTES.VERIFY_APP_CODE}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return response.response.Data.item;
};

const useValidateAuthAppCodeTwoFactorAuthentication = () =>
  useMutation<boolean, IAPIError, IValidateUsingAuthAppRequest>(
    [API_MUTATION_KEY.VALIDATE_AUTH_APP_CODE],
    (values) => validateAuthAppCodeTwoFactorAuthentication(values)
  );

export default useValidateAuthAppCodeTwoFactorAuthentication;
