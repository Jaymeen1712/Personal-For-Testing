import { useQuery } from 'react-query';

import apiClient from '../../../api-client';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';
import { IAxiosResponse, InsightType } from '../../../../types';

const listTimeZones = async () => {
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: InsightType[] }>
  >(`${APIS_ROUTES.TIME_ZONE}`);

  return response.response.Data.items;
};

const useListTimeZones = () =>
  useQuery([API_QUERY_KEY.TIME_ZONES], () => listTimeZones());

export default useListTimeZones;
