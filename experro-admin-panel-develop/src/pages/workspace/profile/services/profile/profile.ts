import { useQuery } from 'react-query';
import Cookies from 'js-cookie';

import {
  IAPIError,
  IAxiosResponse,
  IGetProfileResponse,
} from '../../../../../types';
import {
  API_QUERY_KEY,
  APIS_ROUTES,
  USER_ACCESS_KEY,
} from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

const profile = async () => {
  if (!Cookies.get(USER_ACCESS_KEY.TOKEN)) return;

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ item: IGetProfileResponse }>
  >(APIS_ROUTES.PROFILE);

  return result.response.Data.item;
};

const useProfile = () =>
  useQuery<IGetProfileResponse | undefined, IAPIError>(
    [API_QUERY_KEY.PROFILE],
    profile,
    { cacheTime: 0 }
  );

export default useProfile;
