import { useMutation } from 'react-query';

import {
  IAPIError,
  ModelData,
  IAxiosResponse,
  IAPIToken,
} from '../../../../types';
import apiClient from '../../../api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../utills';
import shapeCollection from '../../../../utills/convert-request-response';

const updateModel = async (values: ModelData, workspaceId: string) => {
  const result = await apiClient.put<
    ModelData,
    IAxiosResponse<{ item: IAPIToken }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/contents/${values.contentModelId}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};
const useUpdateModel = (workspaceId: string) =>
  useMutation<IAPIToken, IAPIError, ModelData>(
    [API_MUTATION_KEY.CONTENT_MODEL_UPDATE_MODEL],
    (values) => updateModel(values, workspaceId)
  );

export default useUpdateModel;
