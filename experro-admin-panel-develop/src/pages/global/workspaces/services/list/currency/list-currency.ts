import { useQuery } from 'react-query';
import apiClient from '../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  ICurrencyResponse,
} from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

const listCurrency = async () => {
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: ICurrencyResponse[] }>
  >(APIS_ROUTES.CURRENCY);

  return response.response.Data.items;
};

const useListCurrency = () =>
  useQuery<ICurrencyResponse[], IAPIError>(
    [API_QUERY_KEY.CURRENCY],
    listCurrency
  );

export default useListCurrency;
