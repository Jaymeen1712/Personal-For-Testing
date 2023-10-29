import { useMutation } from 'react-query';

import {
  IAPIError,
  FormFieldValues,
  IAxiosResponse,
  IAPIToken,
} from '../../../../../types';
import apiClient from '../../../../../apis/api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../utills';
import shapeCollection from '../../../../../utills/convert-request-response';

const creatUpdateNewRecord = async (
  workspaceId: string,
  values: FormFieldValues
) => {
  const result = await apiClient.patch<
    FormFieldValues,
    IAxiosResponse<{ item: IAPIToken }>
  >(
    `${APIS_ROUTES.CONTENT_LIBRARY_SERVICE}/${workspaceId}/contents/${values.contentModalId}/content-model-data/${values.contentModelDataId}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};

const useCreatUpdateNewRecord = (workspaceId: string) =>
  useMutation<IAPIToken, IAPIError, FormFieldValues>(
    [API_MUTATION_KEY.CREATE_NEW_RECORD, workspaceId],
    (values: FormFieldValues) => creatUpdateNewRecord(workspaceId, values)
  );

export default useCreatUpdateNewRecord;
