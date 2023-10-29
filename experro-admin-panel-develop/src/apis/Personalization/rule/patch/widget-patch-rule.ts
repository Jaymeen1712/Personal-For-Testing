import { useMutation } from 'react-query';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills';
import { IAPIError, IAxiosResponse, IRule } from '../../../../types';
import apiClient from '../../../api-client';
import shapeCollection from '../../../../utills/convert-request-response';

const widgetPatchRule = async (
  widgetRule: IRule,
  contentModalId?: string,
  contentModalDataId?: string,
  workspaceId?: string
) => {
  const response = await apiClient.patch<
    IRule,
    IAxiosResponse<{ message: string }>
  >(
    `${APIS_ROUTES.PERSONALIZATION_SERVICE}/${workspaceId}/contents/${contentModalId}/content-model-data/${contentModalDataId}/widget-rules`,
    shapeCollection(widgetRule, false, 'camelToSnackCase')
  );

  return response.response.Data.message;
};

const useWidgetPatchRule = (
  workspaceId: string,
  contentModalId?: string,
  contentModalDataId?: string
) =>
  useMutation<string, IAPIError, IRule>(
    [API_MUTATION_KEY.PATCH_WIDGET_RULE],
    (widgetRule) =>
      widgetPatchRule(
        widgetRule,
        contentModalId,
        contentModalDataId,
        workspaceId
      )
  );

export default useWidgetPatchRule;
