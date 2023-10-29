import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAPIError, IAxiosResponse } from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import shapeCollection from '../../../../../../utills/convert-request-response';

interface IEnableDisableMultiFactorAuthenticationRequest {
  type: string;
  value: boolean | string;
  isInitial: boolean;
}

const enableDisableTwoFactorAuthentication = async (
  values: IEnableDisableMultiFactorAuthenticationRequest
) => {
  const response = await apiClient.patch<
    IEnableDisableMultiFactorAuthenticationRequest,
    IAxiosResponse<{ item: boolean }>
  >(
    `${APIS_ROUTES.ENABLE_DISABLE_TWO_FACTOR_AUTHENTICATION}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return response.response.Data.item;
};

const useEnableDisableTwoFactorAuthentication = () =>
  useMutation<
    boolean,
    IAPIError,
    IEnableDisableMultiFactorAuthenticationRequest
  >([API_MUTATION_KEY.ENABLE_DISABLE_TWO_FACTOR_AUTHENTICATION], (values) =>
    enableDisableTwoFactorAuthentication(values)
  );

export default useEnableDisableTwoFactorAuthentication;
