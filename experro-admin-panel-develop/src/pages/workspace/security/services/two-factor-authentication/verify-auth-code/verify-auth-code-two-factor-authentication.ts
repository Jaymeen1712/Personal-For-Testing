import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAPIError, IAxiosResponse } from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import shapeCollection from '../../../../../../utills/convert-request-response';

interface IVerifyAuthCodeRequest {
  authAppCode: string;
}

const verifyAuthCodeTwoFactorAuthentication = async (
  values: IVerifyAuthCodeRequest
) => {
  const response = await apiClient.post<
    IVerifyAuthCodeRequest,
    IAxiosResponse<{ item: string | boolean }>
  >(
    `${APIS_ROUTES.VERIFY_QR_CODE}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return response.response.Data.item;
};

const useVerifyAuthCodeTwoFactorAuthentication = () =>
  useMutation<string | boolean, IAPIError, IVerifyAuthCodeRequest>(
    [API_MUTATION_KEY.VERIFY_CODE],
    (values) => verifyAuthCodeTwoFactorAuthentication(values)
  );

export default useVerifyAuthCodeTwoFactorAuthentication;
