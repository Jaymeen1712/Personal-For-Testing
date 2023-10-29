import { useMutation } from 'react-query';

import {
  IAPIError,
  FormFieldValues,
  IAxiosResponse,
  IAPIToken,
} from '../../../../../../../types';
import apiClient from '../../../../../../../apis/api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../../../utills';
import shapeCollection from '../../../../../../../utills/convert-request-response';

interface IValue {
  fields: { id: string; position: number }[];
}
const reorderField = async (
  workspaceId: string,
  contentModelId: string | undefined,
  values: IValue
) => {
  const result = await apiClient.patch<
    FormFieldValues,
    IAxiosResponse<{ item: IAPIToken }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/contents/${contentModelId}/content-fields/reorder`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};
const useReorderField = (
  workspaceId: string,
  contentModelId: string | undefined
) =>
  useMutation<IAPIToken, IAPIError, IValue>(
    [API_MUTATION_KEY.FIELD_REORDER],
    (values) => reorderField(workspaceId, contentModelId, values)
  );

export default useReorderField;
