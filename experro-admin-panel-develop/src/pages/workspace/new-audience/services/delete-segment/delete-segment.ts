import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAPIError } from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';

const deleteSegment = async (workspaceId: string, sagmentId: string) => {
  await apiClient.delete(
    `${APIS_ROUTES.AUDIENCE_SERVICE}/${workspaceId}/segments/${sagmentId}`
  );
};

const useDeleteSegment = (workspaceId: string) =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.DELETE_SEGMENT],
    (sagmentId) => deleteSegment(workspaceId, sagmentId)
  );

export default useDeleteSegment;
