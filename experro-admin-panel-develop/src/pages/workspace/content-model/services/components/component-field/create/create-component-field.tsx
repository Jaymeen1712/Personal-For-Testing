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

const createComponentField = async (
  values: FormFieldValues,
  workspaceId: string,
  contentModelId: string | undefined
) => {
  const result = await apiClient.post<
    FormFieldValues,
    IAxiosResponse<{ item: IAPIToken }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/components/${contentModelId}/component-fields`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};
const useCreateComponentField = (
  workspaceId: string,
  contentModelId: string | undefined
) =>
  useMutation<IAPIToken, IAPIError, FormFieldValues>(
    [API_MUTATION_KEY.CREATE_CONTENT_FIELD],
    (values) => createComponentField(values, workspaceId, contentModelId)
  );

export default useCreateComponentField;
