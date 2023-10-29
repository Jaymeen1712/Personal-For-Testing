import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAPIError, IAxiosResponse, ILanguage } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const listLanguage = async () => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: ILanguage[] }>
  >(APIS_ROUTES.LANGUAGES, { params: { fields: 'locale' } });

  return result.response.Data.items;
};

const useListLanguages = () =>
  useQuery<ILanguage[], IAPIError>([API_QUERY_KEY.LANGUAGES], listLanguage, {
    cacheTime: 0,
  });

export default useListLanguages;
