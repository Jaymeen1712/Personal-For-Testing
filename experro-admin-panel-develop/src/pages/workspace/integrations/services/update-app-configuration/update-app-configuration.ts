import { useMutation } from 'react-query';

import { IAPIError, IAxiosResponse } from '../../../../../types';
import apiClient from '../../../../../apis/api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../utills';
import shapeCollection from '../../../../../utills/convert-request-response';

interface RequestObject {
  id: string;
  spaceId: boolean;
  accessToken: string;
  integrationEnvironmentId: string;
  integrationName: string;
}

const updateAppConfiguration = async (
  values: RequestObject,
  workspaceId: string
) => {
  const { id, ...rest } = values;
  const result = await apiClient.put<
    RequestObject,
    IAxiosResponse<{ item: { id: string } }>
  >(
    `${APIS_ROUTES.APP_INTEGRATION_ROUTE}/${workspaceId}/integrations/${id}`,
    shapeCollection(rest, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};
const useUpdateAppConfiguration = (workspaceId: string) =>
  useMutation<{ id: string }, IAPIError, RequestObject>(
    [API_MUTATION_KEY.CONFIGURE_APP],
    (values) => updateAppConfiguration(values, workspaceId)
  );

export default useUpdateAppConfiguration;
