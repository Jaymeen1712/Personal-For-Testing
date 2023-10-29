import { useMutation } from 'react-query';

import {
  IAPIError,
  IAxiosResponse,
  I301Redirect,
  Import301RedirectResponse,
} from '../../../types';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../utills/enums';
import apiClient from '../../api-client';

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
