import { useQuery } from 'react-query';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';
import { IAPIError, IAxiosResponse, IListWidget } from '../../../../types';
import apiClient from '../../../api-client';

const getWidgetDetails = async (
  widgetId?: string,
  workspaceId?: string,
  environmentId?: string | null
) => {
  const response = await apiClient.get<
    null,
    IAxiosResponse<{ item: IListWidget }>
  >(
    `${APIS_ROUTES.PERSONALIZATION_SERVICE}/${workspaceId}/widgets/${widgetId}`,
    {
      params: {
        fieldsToQuery:
          'id,name,description,algorithm_internal_name,is_system_generated',
        environments_id: environmentId,
      },
    }
  );
  return response.response.Data.item;
};

const useGetWidgetDetails = (
  widgetId?: string,
  workspaceId?: string,
  environmentId?: string | null
) =>
  useQuery<IListWidget | undefined, IAPIError>(
    [API_QUERY_KEY.WIDGET_DETAILS, widgetId, workspaceId],
    () => getWidgetDetails(widgetId, workspaceId, environmentId)
  );

export default useGetWidgetDetails;
