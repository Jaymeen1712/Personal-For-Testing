import { useMutation } from 'react-query';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import { IAPIError, IAxiosResponse } from '../../../types';
import apiClient from '../../api-client';
import shapeCollection from '../../../utills/convert-request-response';

interface IValidateUsingRecoveryCodeRequest {
  recoveryCode?: string;
}

const validateRecoveryKeyTwoFactorAuthentication = async (
  values: IValidateUsingRecoveryCodeRequest
) => {
  const response = await apiClient.post<
    IValidateUsingRecoveryCodeRequest,
    IAxiosResponse<{ item: boolean }>
  >(
    `${APIS_ROUTES.VERIFY_RECOVERY_KEY}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return response.response.Data.item;
};

const useValidateRecoveryKeyTwoFactorAuthentication = () =>
  useMutation<boolean, IAPIError, IValidateUsingRecoveryCodeRequest>(
    [API_MUTATION_KEY.VALIDATE_RECOVERY_KEY],
    (values) => validateRecoveryKeyTwoFactorAuthentication(values)
  );

export default useValidateRecoveryKeyTwoFactorAuthentication;
