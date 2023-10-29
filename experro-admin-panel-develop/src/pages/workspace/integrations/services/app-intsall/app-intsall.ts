import { useMutation } from 'react-query';

import { IAPIError, IAxiosResponse } from '../../../../../types';
import apiClient from '../../../../../apis/api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../utills';
import shapeCollection from '../../../../../utills/convert-request-response';

const appInstall = async (
  values: {
    isActivated: boolean;
    integrationInternalName: string;
    masterIntegrationId: string;
    categoryId: string;
  },
  workspaceId: string
) => {
  const result = await apiClient.post<
    {
      isActivated: boolean;
      integrationInternalName: string;
      masterIntegrationId: string;
      categoryId: string;
    },
    IAxiosResponse<{ item: string }>
  >(
    `${APIS_ROUTES.APP_INTEGRATION_ROUTE}/${workspaceId}/integrations`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};
const useAppInstall = (workspaceId: string) =>
  useMutation<
    string,
    IAPIError,
    {
      isActivated: boolean;
      integrationInternalName: string;
      masterIntegrationId: string;
      categoryId: string;
    }
  >([API_MUTATION_KEY.APP_INSTALL], (values) =>
    appInstall(values, workspaceId)
  );

export default useAppInstall;
