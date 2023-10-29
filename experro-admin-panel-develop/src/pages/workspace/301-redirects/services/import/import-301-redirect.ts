import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import {
  I301Redirect,
  IAPIError,
  IAxiosResponse,
  Import301RedirectResponse,
} from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';

const import301Redirect = async (workspaceId: string, redirects?: Blob) => {
  const importData = new FormData();
  if (redirects) {
    importData.append('file', redirects);
  }

  const response = await apiClient.post<
    I301Redirect,
    IAxiosResponse<Import301RedirectResponse>
  >(`${APIS_ROUTES.WORKSPACES}/${workspaceId}/redirects/import`, importData);

  return response.response.Data;
};

const useImport301Redirect = (workspaceId: string) =>
  useMutation<Import301RedirectResponse, IAPIError, Blob | undefined>(
    [API_MUTATION_KEY.IMPORT_301_REDIRECT],
    (redirects) => import301Redirect(workspaceId, redirects)
  );

export default useImport301Redirect;
