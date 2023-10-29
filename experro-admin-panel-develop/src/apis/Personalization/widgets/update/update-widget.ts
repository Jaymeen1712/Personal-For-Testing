import { useMutation } from 'react-query';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills';
import { IAPIError, IAxiosResponse, IUpdateWidget } from '../../../../types';
import apiClient from '../../../api-client';
import shapeCollection from '../../../../utills/convert-request-response';

const updateWidget = async (
  widget: IUpdateWidget,
  widgetId?: string,
  workspaceId?: string,
  environmentId?: string | null
) => {
  const response = await apiClient.put<
    IUpdateWidget,
    IAxiosResponse<{ message: string }>
  >(
    `${APIS_ROUTES.PERSONALIZATION_SERVICE}/${workspaceId}/widgets/${widgetId}`,
    shapeCollection(widget, false, 'camelToSnackCase'),
    {
      params: {
        environments_id: environmentId,
      },
    }
  );
  return response.response.Data.message;
};

const useUpdateWidget = (
  widgetId?: string,
  workspaceId?: string,
  environmentId?: string | null
) =>
  useMutation<string | undefined, IAPIError, IUpdateWidget>(
    [API_MUTATION_KEY.UPDATE_WIDGET],
    (widget) => updateWidget(widget, widgetId, workspaceId, environmentId)
  );

export default useUpdateWidget;
