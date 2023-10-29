import { useQuery } from 'react-query';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';
import apiClient from '../../../../../../apis/api-client';
import { IAxiosResponse } from '../../../../../../types';

interface ISearchGroupResponse {
  id: string;
  name: string;
}

const listGroups = async () => {
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: ISearchGroupResponse[] }>
  >(APIS_ROUTES.GROUP_FILTER);

  return response.response.Data.items?.map((item: ISearchGroupResponse) => ({
    label: item['name'],
    value: item['id'],
  }));
};

const useListGroups = () =>
  useQuery(API_QUERY_KEY.GROUP_SEARCH, listGroups, { cacheTime: 0 });

export default useListGroups;
