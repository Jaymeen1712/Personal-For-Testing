import { useMutation } from 'react-query';

import apiClient from '../../api-client';
import {
  IAPIError,
  IAxiosResponse,
  ISignIn,
  LinkResponse,
} from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills/enums';

const links = async (signIn: ISignIn) => {
  const result = await apiClient.post<ISignIn, IAxiosResponse<LinkResponse>>(
    APIS_ROUTES.LINKS,
    signIn
  );

  return result.response.Data;
};

const useLinks = () =>
  useMutation<LinkResponse, IAPIError, ISignIn>(
    [API_MUTATION_KEY.LINKS],
    links
  );

export default useLinks;
