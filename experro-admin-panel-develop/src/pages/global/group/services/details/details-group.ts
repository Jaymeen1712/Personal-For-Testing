import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IGroup,
  IGroupDetailsResponse,
} from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const detailsGroup = async (groupId?: string | null) => {
  if (!groupId) return undefined;

  const result = await apiClient.get<
    string,
    IAxiosResponse<{ item: IGroupDetailsResponse }>
  >(`${APIS_ROUTES.GROUP}/${groupId}`);

  const { item } = result.response.Data;
  //created this object for the detail of the group .
  return { ...item, roleIds: item.roles, userIds: item.users };
};

const useDetailsGroup = (groupId?: string | null) =>
  useQuery<IGroup | undefined, IAPIError>(
    [API_QUERY_KEY.GROUP_DETAIL, groupId],
    () => detailsGroup(groupId),
    {
      cacheTime: 0,
    }
  );

export default useDetailsGroup;
