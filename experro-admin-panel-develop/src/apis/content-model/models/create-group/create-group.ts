import { useMutation } from 'react-query';

import {
  IAPIError,
  FormFieldValues,
  IAxiosResponse,
  IAPIToken,
} from '../../../../types';
import apiClient from '../../../api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../utills';
import shapeCollection from '../../../../utills/convert-request-response';

const createModelGroup = async (
  values: { groupName: string },
  workspaceId: string
) => {
  const result = await apiClient.post<
    FormFieldValues,
    IAxiosResponse<{ item: IAPIToken }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/content-model-group`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};
const useCreateModelGroup = (workspaceId: string) =>
  useMutation<IAPIToken, IAPIError, { groupName: string }>(
    [API_MUTATION_KEY.CONTENT_MODEL_CREATE_GROUP],
    (values) => createModelGroup(values, workspaceId)
  );

export default useCreateModelGroup;
