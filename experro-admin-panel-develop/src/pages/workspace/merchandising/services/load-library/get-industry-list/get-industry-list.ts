import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAxiosResponse, IIndustry } from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

const getIndustryList = async () => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: IIndustry[] }>
  >(`${APIS_ROUTES.SEARCH_INDUSTRIES}`);

  return result.response.Data.items;
};

const useGetIndustries = () =>
  useQuery([API_QUERY_KEY.INDUSTRY_LIST], () => getIndustryList(), {
    cacheTime: 0,
  });

export default useGetIndustries;
