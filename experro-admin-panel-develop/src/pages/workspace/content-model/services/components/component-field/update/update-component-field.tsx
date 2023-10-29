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

const updateComponentField = async (
  workspaceId: string,
  contentModelId: string | undefined,
  values: FormFieldValues,
  id?: string
) => {
  const result = await apiClient.put<
    FormFieldValues,
    IAxiosResponse<{ item: IAPIToken }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/components/${contentModelId}/component-fields/${id}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};
const useUpdateComponentField = (
  workspaceId: string,
  contentModelId: string | undefined,
  id?: string
) =>
  useMutation<IAPIToken, IAPIError, FormFieldValues>(
    [API_MUTATION_KEY.UPDATE_COMPONENT_FIELD],
    (values) => updateComponentField(workspaceId, contentModelId, values, id)
  );

export default useUpdateComponentField;
