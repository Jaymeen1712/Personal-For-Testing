import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAPIError } from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import shapeCollection from '../../../../../../utills/convert-request-response';

const deleteWidgetRule = async (
  workspaceId: string,
  environment: string | null,
  contentModelDataIds?: string[]
) => {
  await apiClient.post(
    `${APIS_ROUTES.PERSONALIZATION_SERVICE}/${workspaceId}/contents/content-model-data/widget-rules?environments_id=${environment}`,
    shapeCollection(
      { contentModelDataIds: contentModelDataIds },
      false,
      'camelToSnackCase'
    )
  );
};

const useDeleteWidgetRule = (workspaceId: string, environment: string | null) =>
  useMutation<void, IAPIError, string[]>(
    [API_MUTATION_KEY.DELETE_WIDGET_RULE],
    (contentModelDataIds) =>
      deleteWidgetRule(workspaceId, environment, contentModelDataIds)
  );

export default useDeleteWidgetRule;
