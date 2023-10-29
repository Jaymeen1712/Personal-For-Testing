import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import {
  I301Redirect,
  IAPIError,
  IAxiosResponse,
  ICreate301RedirectResponse,
} from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';

const create301Redirect = async (
  redirects: I301Redirect,
  workspaceId: string
) => {
  const response = await apiClient.post<
    I301Redirect,
    IAxiosResponse<ICreate301RedirectResponse>
  >(`${APIS_ROUTES.WORKSPACES}/${workspaceId}/redirects`, redirects);

  return response.response.Data;
};

const useCreate301Redirect = (workspaceId: string) =>
  useMutation<ICreate301RedirectResponse, IAPIError, I301Redirect>(
    [API_MUTATION_KEY.CREATE_301_REDIRECT],
    (redirects) => create301Redirect(redirects, workspaceId)
  );

export default useCreate301Redirect;
