import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAxiosResponse } from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';

const generateRecoveryCodeTwoFactorAuthentication = async () => {
  const response = await apiClient.post<void, IAxiosResponse<{ item: string }>>(
    `${APIS_ROUTES.RECOVERY_CODE}`
  );

  return response.response.Data.item;
};

const useGenerateRecoveryCodeTwoFactorAuthentication = () =>
  useMutation([API_MUTATION_KEY.GENERATE_RECOVERY_KEY], () =>
    generateRecoveryCodeTwoFactorAuthentication()
  );

export default useGenerateRecoveryCodeTwoFactorAuthentication;
