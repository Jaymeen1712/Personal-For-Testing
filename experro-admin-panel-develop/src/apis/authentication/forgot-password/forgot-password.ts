import { useMutation } from 'react-query';

import apiClient from '../../api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills/enums';
import { IAPIError, IForgetPasswordRequest } from '../../../types';
import shapeCollection from '../../../utills/convert-request-response';

const forgotPassword = async (forgotPasswordData: IForgetPasswordRequest) => {
  await apiClient.put(
    APIS_ROUTES.FORGOT_PASSWORD,
    shapeCollection(forgotPasswordData, false, 'camelToSnackCase')
  );
};

export const useForgotPassword = () =>
  useMutation<void, IAPIError, IForgetPasswordRequest>(
    [API_MUTATION_KEY.FORGOT_PASSWORD],
    forgotPassword
  );

export default useForgotPassword;
