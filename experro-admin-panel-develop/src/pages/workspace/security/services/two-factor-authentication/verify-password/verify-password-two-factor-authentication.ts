import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAPIError, IAxiosResponse } from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import shapeCollection from '../../../../../../utills/convert-request-response';

interface IVerifyPasswordRequest {
  password: string;
}

const verifyPasswordTwoFactorAuthentication = async (
  values: IVerifyPasswordRequest
) => {
  const response = await apiClient.post<
    IVerifyPasswordRequest,
    IAxiosResponse<{ item: boolean }>
  >(
    `${APIS_ROUTES.VERIFY_PASSWORD_TWO_FACTOR_AUTHENTICATION}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return response.response.Data.item;
};

const useVerifyPasswordTwoFactorAuthentication = () =>
  useMutation<boolean, IAPIError, IVerifyPasswordRequest>(
    [API_MUTATION_KEY.VERIFY_PASSWORD],
    (values) => verifyPasswordTwoFactorAuthentication(values)
  );

export default useVerifyPasswordTwoFactorAuthentication;
