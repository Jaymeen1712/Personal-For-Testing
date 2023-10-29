import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import { IAPIError } from '../../../../../types';

const deleteProfileImage = async () => {
  await apiClient.delete(`${APIS_ROUTES.PROFILE_IMAGE}`);
};

const useDeleteProfileImage = () =>
  useMutation<void, IAPIError, void>(
    [API_MUTATION_KEY.DELETE_PROFILE_IMAGE],
    deleteProfileImage
  );

export default useDeleteProfileImage;
