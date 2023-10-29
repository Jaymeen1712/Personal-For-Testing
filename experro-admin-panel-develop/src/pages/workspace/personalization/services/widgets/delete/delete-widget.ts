import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAPIError } from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';

const deleteWidget = async (
  workspaceId: string | undefined,
  widgetId?: string
) => {
  await apiClient.delete(
    `${APIS_ROUTES.PERSONALIZATION_SERVICE}/${workspaceId}/widgets/${widgetId}`
  );
};

const useDeleteWidget = (workspaceId: string) =>
  useMutation<void, IAPIError, string | undefined>(
    [API_MUTATION_KEY.DELETE_WIDGET],
    (widgetId) => deleteWidget(workspaceId, widgetId)
  );

export default useDeleteWidget;
