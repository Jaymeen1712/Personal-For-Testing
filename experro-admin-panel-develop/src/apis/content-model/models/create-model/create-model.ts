import { useMutation } from 'react-query';

import { IAPIError, ModelData, IAxiosResponse } from '../../../../types';
import apiClient from '../../../api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../utills';
import shapeCollection from '../../../../utills/convert-request-response';

const createModel = async (values: ModelData, workspaceId: string) => {
  const result = await apiClient.post<
    ModelData,
    IAxiosResponse<{ id: string }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/contents`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.id;
};
const useCreateModel = (workspaceId: string) =>
  useMutation<string, IAPIError, ModelData>(
    [API_MUTATION_KEY.CONTENT_MODEL_CREATE_MODEL],
    (values) => createModel(values, workspaceId)
  );

export default useCreateModel;
