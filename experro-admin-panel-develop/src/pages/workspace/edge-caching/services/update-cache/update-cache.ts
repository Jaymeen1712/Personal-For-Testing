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

const updateCache = async (
  values: { edgeCaching: boolean },
  workspaceId: string
) => {
  const result = await apiClient.patch<
    FormFieldValues,
    IAxiosResponse<{ item: IAPIToken }>
  >(
    `/setting-service/v1/workspaces/${workspaceId}/edge-caching`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};
const useUpdateCache = (workspaceId: string) =>
  useMutation<IAPIToken, IAPIError, { edgeCaching: boolean }>(
    [API_MUTATION_KEY.UPDATE_CACHE],
    (values) => updateCache(values, workspaceId)
  );

export default useUpdateCache;
