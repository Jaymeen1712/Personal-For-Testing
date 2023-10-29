import { useMutation } from 'react-query';

import { IAPIError, FormFieldValues } from '../../../../../types';
import apiClient from '../../../../../apis/api-client';
import { API_MUTATION_KEY } from '../../../../../utills';

const deleteAllCache = async (workspaceId: string) => {
  await apiClient.delete<FormFieldValues, { response: string }>(
    `/setting-service/v1/workspaces/${workspaceId}/edge-caching`,
    {
      params: {
        purge_all: true,
      },
    }
  );
};
const useDeleteAllCache = (workspaceId: string) =>
  useMutation<void, IAPIError, void>(
    [API_MUTATION_KEY.CONTENT_MODEL_ALL_DELETE_CACHE],
    (values) => deleteAllCache(workspaceId)
  );

export default useDeleteAllCache;
