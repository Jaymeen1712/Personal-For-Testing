import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import { IAPIError } from '../../../../../types';
import apiClient from '../../../../../apis/api-client';

const uninstallApp = async (workspaceId?: string, id?: string) => {
  await apiClient.delete(
    `${APIS_ROUTES.APP_INTEGRATION_ROUTE}/${workspaceId}/integrations/${id}`
  );
};

const useUninstallApp = (workspaceId?: string) =>
  useMutation<void, IAPIError, string | undefined>(
    [API_MUTATION_KEY.UNINSTALL_APP],
    (id) => uninstallApp(workspaceId, id)
  );

export default useUninstallApp;
