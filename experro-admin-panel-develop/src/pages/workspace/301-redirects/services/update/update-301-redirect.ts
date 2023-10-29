import { useMutation } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  ICreate301RedirectResponse,
  RedirectFormValues,
} from '../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';

const update301Redirect = async (
  redirects: RedirectFormValues,
  workspaceId: string,
  redirectId: string
) => {
  const response = await apiClient.patch<
    RedirectFormValues,
    IAxiosResponse<ICreate301RedirectResponse>
  >(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/redirects/${redirectId}`,
    redirects
  );

  return response.response.Data;
};

const useUpdate301Redirect = (workspaceId: string, redirectId: string) =>
  useMutation<ICreate301RedirectResponse, IAPIError, RedirectFormValues>(
    [API_MUTATION_KEY.UPDATE_301_REDIRECT],
    (redirects) => update301Redirect(redirects, workspaceId, redirectId)
  );

export default useUpdate301Redirect;
