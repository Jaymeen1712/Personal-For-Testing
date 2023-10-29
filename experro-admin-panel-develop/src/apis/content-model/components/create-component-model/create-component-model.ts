import { useMutation } from 'react-query';

import { IAPIError, ModelData, IAxiosResponse } from '../../../../types';
import apiClient from '../../../api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../utills';
import shapeCollection from '../../../../utills/convert-request-response';

const createComponentModel = async (values: ModelData, workspaceId: string) => {
  const result = await apiClient.post<
    ModelData,
    IAxiosResponse<{ item: { id: string } }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/components`,
    shapeCollection(values, false, 'camelToSnackCase')
  );
  return result.response.Data.item;
};
const useCreateComponentModel = (workspaceId: string) =>
  useMutation<{ id: string }, IAPIError, ModelData>(
    [API_MUTATION_KEY.COMPONENT_MODEL_CREATE_MODEL],
    (values) => createComponentModel(values, workspaceId)
  );

export default useCreateComponentModel;
