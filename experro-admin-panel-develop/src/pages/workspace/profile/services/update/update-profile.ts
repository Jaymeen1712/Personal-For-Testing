import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAPIError, IUpdateProfileRequest } from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import shapeCollection from '../../../../../utills/convert-request-response';

const updateProfile = async (profile: IUpdateProfileRequest) => {
  await apiClient.put(
    `${APIS_ROUTES.PROFILE}`,
    shapeCollection(profile, false, 'camelToSnackCase')
  );
};

const useUpdateProfile = () =>
  useMutation<void, IAPIError, IUpdateProfileRequest>(
    [API_MUTATION_KEY.UPDATE_PROFILE],
    (profile) => updateProfile(profile)
  );

export default useUpdateProfile;
