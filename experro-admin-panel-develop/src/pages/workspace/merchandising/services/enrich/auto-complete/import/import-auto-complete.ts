import { useMutation } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import {
  I301Redirect,
  IAPIError,
  IAxiosResponse,
  Import301RedirectResponse,
} from '../../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';

const importAutoComplete = async (workspaceId: string, redirects?: Blob) => {
  const importData = new FormData();
  if (redirects) {
    importData.append('file', redirects);
  }

  const response = await apiClient.post<
    I301Redirect,
    IAxiosResponse<Import301RedirectResponse>
  >(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/auto-suggester/import`,
    importData
  );

  return response.response.Data;
};

const useImportAutoComplete = (workspaceId: string) =>
  useMutation<Import301RedirectResponse, IAPIError, Blob | undefined>(
    [API_MUTATION_KEY.IMPORT_AUTO_COMPLETE],
    (redirects) => importAutoComplete(workspaceId, redirects)
  );

export default useImportAutoComplete;
