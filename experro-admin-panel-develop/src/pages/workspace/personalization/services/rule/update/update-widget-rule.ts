import { useMutation } from 'react-query';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  IUpdateRuleRequest,
} from '../../../../../../types';
import apiClient from '../../../../../../apis/api-client';
import shapeCollection from '../../../../../../utills/convert-request-response';

const updateWidgetRule = async (
  rule: IUpdateRuleRequest,
  workspaceId?: string,
  contentModalId?: string,
  contentModalDataId?: string
) => {
  const response = await apiClient.put<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    IAxiosResponse<{ message: string }>
  >(
    `${APIS_ROUTES.PERSONALIZATION_SERVICE}/${workspaceId}/contents/${contentModalId}/content-model-data/${contentModalDataId}/widget-rules-data`,
    shapeCollection(rule, false, 'camelToSnackCase')
  );

  return response.response.Data.message;
};

const useUpdateWidgetRule = (
  workspaceId?: string,
  contentModalId?: string,
  contentModalDataId?: string
) =>
  useMutation<string | undefined, IAPIError, IUpdateRuleRequest>(
    [API_MUTATION_KEY.UPDATE_WIDGET_RULE],
    (rule) =>
      updateWidgetRule(rule, workspaceId, contentModalId, contentModalDataId)
  );

export default useUpdateWidgetRule;
