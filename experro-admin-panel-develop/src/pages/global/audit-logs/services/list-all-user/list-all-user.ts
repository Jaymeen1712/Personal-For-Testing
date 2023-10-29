import { useQuery } from 'react-query';
import apiClient from '../../../../../apis/api-client';
import { APIS_ROUTES, API_QUERY_KEY } from '../../../../../utills';
import { IAPIError, IAxiosResponse, IListAllUser } from '../../../../../types';

interface IListAllUserResponse {
  id: string;
  firstName: string;
  lastName: string;
}

const getAllUser = async () => {
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: IListAllUserResponse[] }>
  >(`${APIS_ROUTES.USERS_ALL}`, {
    params: { fields: 'first_name,last_name' },
  });

  response.response.Data.items.sort(function (a, b) {
    if (a.firstName.toLocaleLowerCase() < b.firstName.toLocaleLowerCase()) {
      return -1;
    }
    if (a.firstName.toLocaleLowerCase() > b.firstName.toLocaleLowerCase()) {
      return 1;
    }
    return 0;
  });

  return response.response.Data.items.map((user) => ({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
  }));
};

const useGetAllUser = () =>
  useQuery<IListAllUser[], IAPIError>(
    API_QUERY_KEY.LIST_ALL_USERS,
    getAllUser,
    {
      cacheTime: 0,
    }
  );

export default useGetAllUser;
