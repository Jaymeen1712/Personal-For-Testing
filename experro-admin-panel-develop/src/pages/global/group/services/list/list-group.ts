import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';
import { IAxiosResponse, IListGroup } from '../../../../../types';

const listGroup = async (
  page: number,
  pageSize: number,
  filter?: string,
) => {
  const response = await apiClient.get<
    void,
    IAxiosResponse<{ totalCount: number; items: IListGroup[] }>
  >(`${APIS_ROUTES.GROUP}`, {
    params: {
      search: filter,
      skip: (page - 1) * pageSize,
      limit: pageSize,
    },
  });

  return response.response.Data;
};

const useListGroup = (
  page: number,
  pageSize: number,
  filter?: string,
) =>
  useQuery(
    [API_QUERY_KEY.GROUP_LIST, filter, page, pageSize],
    () => listGroup(page, pageSize, filter),
    {
      cacheTime: 0,
    }
  );

export default useListGroup;
