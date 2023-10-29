import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';
import shapeCollection from '../../../utills/convert-request-response';
import { IAPIError, IAxiosResponse } from '../../../types';

const resetTwoFactorUser = async (userId?: string) => {
  const response = await apiClient.patch<
    string,
    IAxiosResponse<{ item: boolean }>
  >(
    `${APIS_ROUTES.RESET_MFA}`,
    shapeCollection({ userId: userId }, false, 'camelToSnackCase')
  );

  return response.response.Data.item;
};

const useResetTwoFactorUser = () =>
  useMutation<boolean, IAPIError, string | undefined>(
    [API_MUTATION_KEY.RESET_USER_AUTHENTICATION],
    (userId?: string) => resetTwoFactorUser(userId)
  );

export default useResetTwoFactorUser;
