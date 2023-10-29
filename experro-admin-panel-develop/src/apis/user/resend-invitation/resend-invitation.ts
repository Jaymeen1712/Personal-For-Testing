import { useMutation } from 'react-query';

import { IAPIError } from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';

const resendInvitation = async (userId: string) => {
  await apiClient.put(`${APIS_ROUTES.USERS}/${userId}/resend-invitation`);
};

const useResendInvitation = () =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.RESEND_INVITATION],
    resendInvitation
  );

export default useResendInvitation;
