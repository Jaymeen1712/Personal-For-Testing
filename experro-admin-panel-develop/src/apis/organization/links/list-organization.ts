import { useMutation } from 'react-query';

import apiClient from '../../api-client';
import { IAPIError, IAxiosResponse, LinkResponse } from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';

const linksOrganization = async (userName: string) => {
  if (!userName) return;

  const response = await apiClient.post<string, IAxiosResponse<LinkResponse>>(
    APIS_ROUTES.LINKS,
    { username: userName }
  );

  return response.response.Data;
};

const useLinksOrganization = () =>
  useMutation<LinkResponse | undefined, IAPIError, string>(
    [API_MUTATION_KEY.LINKS_ORGANIZATION],
    linksOrganization
  );

export default useLinksOrganization;
