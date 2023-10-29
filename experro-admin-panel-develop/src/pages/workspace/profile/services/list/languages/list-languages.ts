import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAPIError, IAxiosResponse } from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

interface IListLanguagesResponse {
  id: string;
  name: string;
  locale: string;
}

const listLanguages = async () => {
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: IListLanguagesResponse[] }>
  >(APIS_ROUTES.LANGUAGES);

  return response.response.Data.items;
};

const useListLanguages = () =>
  useQuery<IListLanguagesResponse[], IAPIError>(
    [API_QUERY_KEY.LANGUAGES],
    listLanguages
  );

export default useListLanguages;
