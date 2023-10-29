import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills';
import { IAPIError } from '../../../../types';
import apiClient from '../../../api-client';

const deleteComponentGroup = async (workspaceId: string, groupId: string) => {
  await apiClient.delete(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/component-groups/${groupId}`
  );
};

const useDeleteComponentGroup = (workspaceId: string) =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.COMPONENT_DELETE_GROUP],
    (groupId) => deleteComponentGroup(workspaceId, groupId)
  );

export default useDeleteComponentGroup;
