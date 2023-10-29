import { useMutation } from 'react-query';

import { IAPIError, IAxiosResponse } from '../../../../../types';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../utills/enums';
import apiClient from '../../../../../apis/api-client';

const deleteGlobalRole = async (roleId: string) => {
  await apiClient.delete<null, IAxiosResponse<{ item: string }>>(
    `${APIS_ROUTES.ROLES}/${roleId}`
  );
};

const useDeleteGlobalRole = () =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.DELETE_GLOBAL_ROLE],
    deleteGlobalRole
  );

export default useDeleteGlobalRole;
