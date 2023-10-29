import { useQuery } from 'react-query';
import apiClient from '../../api-client';
import { APIS_ROUTES, API_QUERY_KEY } from '../../../utills/enums';
import { IAxiosResponse } from '../../../types';

interface ISearchGroupResponse {
  id: string;
  name: string;
}

const searchGroup = async () => {
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: ISearchGroupResponse[] }>
  >(APIS_ROUTES.GROUP_FILTER);

  return response.response.Data.items?.map((item: ISearchGroupResponse) => ({
    label: item['name'],
    value: item['id'],
  }));
};

const useSearchGroup = () =>
  useQuery(API_QUERY_KEY.GROUP_SEARCH, searchGroup, { cacheTime: 0 });

export default useSearchGroup;
