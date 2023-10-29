import { useMutation } from 'react-query';

import { IAPIError, ISetPasswordRequest } from '../../../../../types';
import apiClient from '../../../../../apis/api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import shapeCollection from '../../../../../utills/convert-request-response';

const setPassword = async (
  password: ISetPasswordRequest,
  tokenId?: string | null
) => {
  await apiClient.put(
    `${APIS_ROUTES.SET_PASSWORD}/${tokenId}`,
    shapeCollection(password, false, 'camelToSnackCase')
  );
};

const useSetPassword = (tokenId?: string | null) =>
  useMutation<void, IAPIError, ISetPasswordRequest>(
    [API_MUTATION_KEY.SET_PASSWORD],
    (password) => setPassword(password, tokenId)
  );

export default useSetPassword;
