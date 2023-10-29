import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import { IAPIError } from '../../../../../types';

const deleteGroup = async (groupId: string) => {
  await apiClient.delete(`${APIS_ROUTES.GROUP}/${groupId}`);
};

const useDeleteGroup = () =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.DELETE_GROUP],
    deleteGroup
  );

export default useDeleteGroup;
