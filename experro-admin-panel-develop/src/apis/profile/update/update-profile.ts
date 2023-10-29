import { useMutation } from 'react-query';

import apiClient from '../../api-client';
import { IAPIError, IUpdateProfileRequest } from '../../../types';
import shapeCollection from '../../../utills/convert-request-response';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills/enums';

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
