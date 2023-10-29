import { useMutation } from 'react-query';

import apiClient from '../../../../apis/api-client';
import { IAPIError, IAxiosResponse, IRule } from '../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills';
import shapeCollection from '../../../../utills/convert-request-response';

const patchRule = async (
  rule: IRule,
  contentModalId?: string,
  contentModalDataId?: string,
  workspaceId?: string
) => {
  const response = await apiClient.patch<
    IRule,
    IAxiosResponse<{ message: string }>
  >(
    `${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/contents/${contentModalId}/content-model-data/${contentModalDataId}/rules`,
    shapeCollection(rule, false, 'camelToSnackCase')
  );

  return response.response.Data.message;
};

const usePatchRule = (
  workspaceId: string,
  contentModalId?: string,
  contentModalDataId?: string
) =>
  useMutation<string, IAPIError, IRule>([API_MUTATION_KEY.PATCH_RULE], (rule) =>
    patchRule(rule, contentModalId, contentModalDataId, workspaceId)
  );

export default usePatchRule;
