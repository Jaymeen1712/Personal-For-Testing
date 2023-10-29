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
const reorderComponentField = async (
  workspaceId: string,
  contentModelId: string | undefined,
  values: IValue
) => {
  const result = await apiClient.patch<
    FormFieldValues,
    IAxiosResponse<{ item: IAPIToken }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/components/${contentModelId}/component-fields/reorder`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};
const useReorderComponentField = (
  workspaceId: string,
  contentModelId: string | undefined
) =>
  useMutation<IAPIToken, IAPIError, IValue>(
    [API_MUTATION_KEY.COMPONENT_FIELDS_REORDER],
    (values) => reorderComponentField(workspaceId, contentModelId, values)
  );

export default useReorderComponentField;
