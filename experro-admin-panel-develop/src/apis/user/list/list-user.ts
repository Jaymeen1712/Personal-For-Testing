import { useQuery } from 'react-query';
import apiClient from '../../api-client';
import { APIS_ROUTES, API_QUERY_KEY } from '../../../utills/enums';
import { IAxiosResponse, ISelectUserResponse } from '../../../types';

const listUser = async () => {
  const response = await apiClient.get<
    null,
    IAxiosResponse<ISelectUserResponse>
  >(`${APIS_ROUTES.USERS}/filter`);

  return response.response.Data.items;
};

const useListUser = () =>
  useQuery(API_QUERY_KEY.GROUP_USERS, listUser, { cacheTime: 0 });

export default useListUser;
