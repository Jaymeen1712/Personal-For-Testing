import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IGroupUser,
  IGroupUsersResponse,
} from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const groupUsers = async (id?: string) => {
  if (!id) return [];
  const response = await apiClient.get<
    string,
    IAxiosResponse<IGroupUsersResponse>
  >(`${APIS_ROUTES.GROUP}/${id}/users`);
  const groupUsersList = response.response.Data.items;
  const groupUsers: IGroupUser[] = [];

  groupUsersList.forEach((groupUser) => {
    const user = {
      firstname: groupUser.firstName,
      lastname: groupUser.lastName,
      email: groupUser.email,
    };
    groupUsers.push(user);
  });
  return groupUsers;
};

const useGroupUsers = (id?: string) =>
  useQuery<IGroupUser[], IAPIError>([API_QUERY_KEY.GROUP_USERS, id], () =>
    groupUsers(id)
  );

export default useGroupUsers;
