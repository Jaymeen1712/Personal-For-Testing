import { useMutation } from 'react-query';

import {
  IAPIError,
  FormFieldValues,
  IAxiosResponse,
  IAPIToken,
  ReorderObject,
} from '../../../../types';
import apiClient from '../../../api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../utills';
import shapeCollection from '../../../../utills/convert-request-response';

const reorderModel = async (
  values: { contentModels: ReorderObject[]; groups: ReorderObject[] },
  workspaceId: string
) => {
  const result = await apiClient.patch<
    FormFieldValues,
    IAxiosResponse<{ item: IAPIToken }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/contents-groups/positions`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};
const useReorderModel = (workspaceId: string) =>
  useMutation<
    IAPIToken,
    IAPIError,
    { contentModels: ReorderObject[]; groups: ReorderObject[] }
  >([API_MUTATION_KEY.REORDER_MODEL], (values) =>
    reorderModel(values, workspaceId)
  );

export default useReorderModel;
