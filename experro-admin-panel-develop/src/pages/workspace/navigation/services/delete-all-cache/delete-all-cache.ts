import { useMutation } from 'react-query';

import { IAPIError, FormFieldValues } from '../../../../../types';
import apiClient from '../../../../../apis/api-client';
import { API_MUTATION_KEY } from '../../../../../utills';

const deleteAllCache = async (workspaceId: string) => {
  if (!workspaceId) return;

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
    [API_MUTATION_KEY.NAVIGATION_ALL_CACHE_DELETE],
    (values) => deleteAllCache(workspaceId)
  );

export default useDeleteAllCache;
