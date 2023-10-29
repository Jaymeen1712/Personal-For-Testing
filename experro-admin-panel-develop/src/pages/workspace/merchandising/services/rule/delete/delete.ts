import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import shapeCollection from '../../../../../../utills/convert-request-response';
import { IAPIError } from '../../../../../../types';

const deleteRule = async (
  workspaceId: string,
  contentModelId: string | undefined,
  contentModelDataIds: string[],
  environment?: string | null
) => {
  await apiClient.post(
    `${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/contents/content-model-data/rules`,
    shapeCollection(
      { contentModelDataIds: contentModelDataIds, environmentsId: environment },
      false,
      'camelToSnackCase'
    )
  );
};

const useDeleteRule = (
  workspaceId: string,
  contentModelId: string | undefined,
  environment?: string | null
) =>
  useMutation<void, IAPIError, string[]>(
    [API_MUTATION_KEY.DELETE_RULE],
    (contentModelDataIds) =>
      deleteRule(workspaceId, contentModelId, contentModelDataIds, environment)
  );

export default useDeleteRule;
