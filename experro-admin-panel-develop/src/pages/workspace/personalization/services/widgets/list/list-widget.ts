import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAxiosResponse, IListWidget } from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

const listWidget = async (
  workspaceId: string,
  environmentId?: string | null
) => {
  const response = await apiClient.get<
    string,
    IAxiosResponse<{ items: IListWidget[] }>
  >(`${APIS_ROUTES.PERSONALIZATION_SERVICE}/${workspaceId}/widgets`, {
    params: {
      fieldsToQuery:
        'id,name,description,is_system_generated,algorithm_internal_name',
      environments_id: environmentId,
    },
  });

  return response.response.Data.items;
};

const useListWidget = (workspaceId: string, environmentId?: string | null) =>
  useQuery(
    [API_QUERY_KEY.WIDGET_LIST, workspaceId, environmentId],
    () => listWidget(workspaceId, environmentId),
    {
      cacheTime: 0,
    }
  );

export default useListWidget;
