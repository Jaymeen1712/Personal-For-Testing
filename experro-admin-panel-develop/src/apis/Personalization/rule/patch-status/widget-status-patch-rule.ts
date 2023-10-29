import { useMutation } from 'react-query';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills';
import { IAPIError, IAxiosResponse, IRule } from '../../../../types';
import apiClient from '../../../api-client';
import shapeCollection from '../../../../utills/convert-request-response';

const widgetStatusPatchRule = async (
  widgetRuleStatusData: IRule,
  contentModalId?: string,
  contentModalDataId?: string,
  workspaceId?: string
) => {
  const response = await apiClient.patch<
    IRule,
    IAxiosResponse<{ message: string }>
  >(
    `${APIS_ROUTES.PERSONALIZATION_SERVICE}/${workspaceId}/contents/${contentModalId}/content-model-data/${contentModalDataId}/widget-rules-data`,
    shapeCollection(widgetRuleStatusData, false, 'camelToSnackCase')
  );

  return response.response.Data.message;
};

const useWidgetStatusPatchRule = (
  workspaceId: string,
  contentModalId?: string,
  contentModalDataId?: string
) =>
  useMutation<string, IAPIError, IRule>(
    [API_MUTATION_KEY.PATCH_WIDGET_RULE_STATUS],
    (widgetRuleStatusData) =>
      widgetStatusPatchRule(
        widgetRuleStatusData,
        contentModalId,
        contentModalDataId,
        workspaceId
      )
  );

export default useWidgetStatusPatchRule;
