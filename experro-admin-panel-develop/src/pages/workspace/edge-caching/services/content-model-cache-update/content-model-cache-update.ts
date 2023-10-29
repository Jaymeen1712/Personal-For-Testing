import { useMutation } from 'react-query';

import {
  IAPIError,
  FormFieldValues,
  IAxiosResponse,
  IAPIToken,
} from '../../../../../types';
import apiClient from '../../../../../apis/api-client';
import { API_MUTATION_KEY } from '../../../../../utills';
import shapeCollection from '../../../../../utills/convert-request-response';

const contentModelUpdateCache = async (
  values: { contentModelId: string; edgeCaching: boolean },
  workspaceId: string
) => {
  const result = await apiClient.patch<
    FormFieldValues,
    IAxiosResponse<{ item: IAPIToken }>
  >(
    `/setting-service/v1/workspaces/${workspaceId}/content-model/edge-caching`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};
const useContentModelUpdateCache = (workspaceId: string) =>
  useMutation<
    IAPIToken,
    IAPIError,
    { contentModelId: string; edgeCaching: boolean }
  >([API_MUTATION_KEY.CONTENT_MODEL_UPDATE_CACHE], (values) =>
    contentModelUpdateCache(values, workspaceId)
  );

export default useContentModelUpdateCache;
