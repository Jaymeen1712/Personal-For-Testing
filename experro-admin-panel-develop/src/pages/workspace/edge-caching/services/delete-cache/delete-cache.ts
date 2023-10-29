import { useMutation } from 'react-query';

import { IAPIError, FormFieldValues } from '../../../../../types';
import apiClient from '../../../../../apis/api-client';
import { API_MUTATION_KEY } from '../../../../../utills';

const deleteCache = async (
  values: {
    contentModelId: string;
    cacheIsLocal: boolean;
    contentModalName: string;
  },
  workspaceId: string
) => {
  await apiClient.delete<FormFieldValues, { response: string }>(
    `/setting-service/v1/workspaces/${workspaceId}/edge-caching`,
    {
      params: {
        content_model_id: values.contentModelId,
        edge_cache: true,
        local_cache: values.cacheIsLocal,
        content_modal_name: values.contentModalName,
      },
    }
  );
};
const useDeleteCache = (workspaceId: string) =>
  useMutation<
    void,
    IAPIError,
    { contentModelId: string; cacheIsLocal: boolean; contentModalName: string }
  >([API_MUTATION_KEY.CONTENT_MODEL_DELETE_CACHE], (values) =>
    deleteCache(values, workspaceId)
  );

export default useDeleteCache;
