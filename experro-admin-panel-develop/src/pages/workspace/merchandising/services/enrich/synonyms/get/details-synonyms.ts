import { useQuery } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IDetailSynonyms,
} from '../../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../../utills';

const detailsSynonyms = async (workspaceId: string, synonymId?: string) => {
  if (!synonymId?.length) return;

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ item: IDetailSynonyms }>
  >(`${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/synonyms/${synonymId}`);

  return result.response.Data.item;
};

const useDetailsSynonyms = (workspaceId: string, synonymId?: string) =>
  useQuery<IDetailSynonyms | undefined, IAPIError>(
    [API_QUERY_KEY.DETAILS_SYNONYMS],
    () => detailsSynonyms(workspaceId, synonymId),
    { cacheTime: 0 }
  );

export default useDetailsSynonyms;
