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

const createComponentGroup = async (
  values: { groupName: string },
  workspaceId: string
) => {
  const result = await apiClient.post<
    FormFieldValues,
    IAxiosResponse<{ item: IAPIToken }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/component-group`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};
const useCreateComponentGroup = (workspaceId: string) =>
  useMutation<IAPIToken, IAPIError, { groupName: string }>(
    [API_MUTATION_KEY.COMPONENT_CREATE_GROUP],
    (values) => createComponentGroup(values, workspaceId)
  );

export default useCreateComponentGroup;
