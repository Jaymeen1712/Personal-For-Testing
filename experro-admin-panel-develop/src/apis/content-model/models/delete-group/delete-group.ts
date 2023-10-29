import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills';
import { IAPIError } from '../../../../types';
import apiClient from '../../../api-client';

const deleteGroup = async (workspaceId: string, groupId: string) => {
  await apiClient.delete(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/content-model-groups/${groupId}`
  );
};

const useDeleteGroup = (workspaceId: string) =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.CONTENT_MODEL_DELETE_GROUP],
    (groupId) => deleteGroup(workspaceId, groupId)
  );

export default useDeleteGroup;
