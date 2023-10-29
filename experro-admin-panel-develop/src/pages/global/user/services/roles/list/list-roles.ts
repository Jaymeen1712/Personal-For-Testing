import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';
import apiClient from '../../../../../../apis/api-client';
import {
  IAxiosResponse,
  IRole,
  IRoleListResponse,
} from '../../../../../../types';

const listRoles = async () => {
  const result = await apiClient.get<IRole, IAxiosResponse<IRoleListResponse>>(
    APIS_ROUTES.ROLES
  );

  const parentOptions = result.response.Data.items
    ?.filter(
      (item: IRole, index: number, self: IRole[]) =>
        self.findIndex(
          (selfItem: IRole) => selfItem['workspaceId'] === item['workspaceId']
        ) === index
    )
    .map((item: IRole) => ({
      title: item['workspaceName'] || 'Global',
      displayTitle: item['workspaceName'] || 'Global',
      value: item['workspaceId'] || 'global',
      children: [],
    }));

  parentOptions?.forEach((parentOption: IRole) => {
    parentOption.children = result.response.Data.items
      ?.filter(
        (item: IRole) =>
          (item['workspaceId'] || 'global') === parentOption.value
      )
      .map((item: IRole) => ({
        label: item['name'],
        displayTitle: `${parentOption.title} - ${item['name']}`,
        value: item['id'],
      }));
  });

  return parentOptions;
};

const useListRoles = () =>
  useQuery([API_QUERY_KEY.ALL_ROLE_LIST], listRoles, { cacheTime: 0 });

export default useListRoles;
