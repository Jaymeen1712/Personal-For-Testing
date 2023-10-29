import { useMutation } from 'react-query';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  ICreateWidgetRule,
  ICreateWidgetRuleResponse,
  IRule,
} from '../../../../types';
import apiClient from '../../../api-client';
import shapeCollection from '../../../../utills/convert-request-response';

const createWidgetRule = async (
  rule: ICreateWidgetRule,
  workspaceId?: string
) => {
  const response = await apiClient.post<
    IRule,
    IAxiosResponse<{ item: ICreateWidgetRuleResponse }>
  >(
    `${APIS_ROUTES.PERSONALIZATION_SERVICE}/${workspaceId}/widget-rules`,
    shapeCollection(rule, false, 'camelToSnackCase')
  );

  return response.response.Data.item;
};

const useCreateWidgetRule = (workspaceId?: string) =>
  useMutation<ICreateWidgetRuleResponse, IAPIError, ICreateWidgetRule>(
    [API_MUTATION_KEY.CREATE_WIDGET_RULE],
    (rule) => createWidgetRule(rule, workspaceId)
  );

export default useCreateWidgetRule;
