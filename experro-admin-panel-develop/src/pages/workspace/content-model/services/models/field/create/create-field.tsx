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

const createField = async (
  values: FormFieldValues,
  workspaceId: string,
  contentModelId: string | undefined
) => {
  const result = await apiClient.post<
    FormFieldValues,
    IAxiosResponse<{ item: IAPIToken }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/contents/${contentModelId}/content-fields`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};
const useCreateField = (
  workspaceId: string,
  contentModelId: string | undefined
) =>
  useMutation<IAPIToken, IAPIError, FormFieldValues>(
    [API_MUTATION_KEY.CREATE_CONTENT_FIELD, workspaceId, contentModelId],
    (values) => createField(values, workspaceId, contentModelId)
  );

export default useCreateField;
