import { useMutation } from 'react-query';

import {
  IAPIError,
  FormFieldValues,
  IAxiosResponse,
  IAPIToken,
} from '../../../../../../types';
import apiClient from '../../../../../../apis/api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../../utills';
import shapeCollection from '../../../../../../utills/convert-request-response';

const updateModelGroup = async (
  values: { groupId: string; groupName: string; position: number },
  workspaceId: string
) => {
  const { groupId, ...rest } = values;
  const result = await apiClient.put<
    FormFieldValues,
    IAxiosResponse<{ item: IAPIToken }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/content-model-groups/${groupId}`,
    shapeCollection(rest, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};
const useUpdateModelGroup = (workspaceId: string) =>
  useMutation<
    IAPIToken,
    IAPIError,
    { groupId: string; groupName: string; position: number }
  >([API_MUTATION_KEY.CONTENT_MODEL_UPDATE_GROUP], (values) =>
    updateModelGroup(values, workspaceId)
  );

export default useUpdateModelGroup;
