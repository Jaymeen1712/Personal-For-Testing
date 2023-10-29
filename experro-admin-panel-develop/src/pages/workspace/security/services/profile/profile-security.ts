import { useQuery } from 'react-query';
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
import Cookies from 'js-cookie';
import apiClient from '../../../../../apis/api-client';

const profileSecurity = async () => {
  if (!Cookies.get(USER_ACCESS_KEY.TOKEN)) return;

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ item: IGetProfileResponse }>
  >(APIS_ROUTES.PROFILE);

  return result.response.Data.item;
};

const useProfileSecurity = () =>
  useQuery<IGetProfileResponse | undefined, IAPIError>(
    [API_QUERY_KEY.PROFILE],
    profileSecurity,
    { cacheTime: 0 }
  );

export default useProfileSecurity;
