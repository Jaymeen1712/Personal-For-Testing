import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import {
  IAxiosResponse,
  ISearchSettingResponse,
} from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

const getSettingDetails = async (workspaceId: string, type: string) => {
  if (!type) return;

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ item: ISearchSettingResponse }>
  >(`${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/search-setting/${type}`, {
    params: {
      fieldsToQuery:
        'id,is_enabled,is_smart_suggestion,type,smart_suggestion_property',
    },
  });

  return result.response.Data.item;
};

const useGetSettingDetails = (workspaceId: string, type: string) =>
  useQuery(
    [API_QUERY_KEY.GET_SETTING_DETAILS, type],
    () => getSettingDetails(workspaceId, type),
    { cacheTime: 0 }
  );

export default useGetSettingDetails;
