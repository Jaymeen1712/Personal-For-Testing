import { useMutation } from 'react-query';

import {
  IAPIError,
  FormFieldValues,
  IAxiosResponse,
  IAPIToken,
  ReorderObject,
} from '../../../../../../types';
import apiClient from '../../../../../../apis/api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../../utills';
import shapeCollection from '../../../../../../utills/convert-request-response';

const reorderComponents = async (
  values: { components: ReorderObject[]; groups: ReorderObject[] },
  workspaceId: string
) => {
  const result = await apiClient.patch<
    FormFieldValues,
    IAxiosResponse<{ item: IAPIToken }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/components-groups/positions`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};
const useReorderComponents = (workspaceId: string) =>
  useMutation<
    IAPIToken,
    IAPIError,
    { components: ReorderObject[]; groups: ReorderObject[] }
  >([API_MUTATION_KEY.REORDER_COMPONENT], (values) =>
    reorderComponents(values, workspaceId)
  );

export default useReorderComponents;
