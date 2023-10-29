import { useMutation } from 'react-query';

import apiClient from '../../api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import { IAPIError } from '../../../types';

const verifyUser = async (token: string) => {
  await apiClient.post(`${APIS_ROUTES.VERIFY_USER}/${token}`);
};

const useVerifyUser = () =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.VERIFY_USER],
    verifyUser
  );

export default useVerifyUser;
