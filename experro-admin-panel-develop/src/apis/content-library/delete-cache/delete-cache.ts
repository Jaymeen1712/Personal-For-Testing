import { useMutation } from 'react-query';

import { IAPIError, FormFieldValues } from '../../../types';
import apiClient from '../../api-client';
import { API_MUTATION_KEY } from '../../../utills';

const deleteCache = async (
  values: {
    pageSlug: string;
    contentModalId: string;
    contentModalDataId: string;
  },
  workspaceId: string
) => {
  await apiClient.delete<FormFieldValues, { response: string }>(
    `/setting-service/v1/workspaces/${workspaceId}/edge-caching`,
    {
      params: {
        edge_cache: true,
        local_cache: true,
        page_slug: values.pageSlug,
        content_model_id: values.contentModalId,
        content_model_data_id: values.contentModalDataId,
      },
    }
  );
};
const useDeleteCache = (workspaceId: string) =>
  useMutation<
    void,
    IAPIError,
    { pageSlug: string; contentModalId: string; contentModalDataId: string }
  >([API_MUTATION_KEY.CONTENT_MODEL_DELETE_CACHE], (values) =>
    deleteCache(values, workspaceId)
  );

export default useDeleteCache;
