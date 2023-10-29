import { useMutation } from 'react-query';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  ICreateWidgetRuleResponse,
  IRule,
  IWidget,
} from '../../../../types';
import apiClient from '../../../api-client';
import shapeCollection from '../../../../utills/convert-request-response';

const createWidget = async (widget: IWidget, workspaceId?: string) => {
  const response = await apiClient.post<
    IRule,
    IAxiosResponse<{ item: ICreateWidgetRuleResponse }>
  >(
    `${APIS_ROUTES.PERSONALIZATION_SERVICE}/${workspaceId}/widgets`,
    shapeCollection(widget, false, 'camelToSnackCase')
  );

  console.log('res=====', response);

  return response.response.Data.item;
};

const useCreateWidget = (workspaceId?: string) =>
  useMutation<ICreateWidgetRuleResponse, IAPIError, IRule>(
    [API_MUTATION_KEY.CREATE_WIDGET],
    (widget) => createWidget(widget, workspaceId)
  );

export default useCreateWidget;
