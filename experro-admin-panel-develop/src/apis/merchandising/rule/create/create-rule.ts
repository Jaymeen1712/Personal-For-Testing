import { useMutation } from 'react-query';

import apiClient from '../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  ICreateRuleResponse,
  IRule,
} from '../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills';
import shapeCollection from '../../../../utills/convert-request-response';

const createRule = async (rule: IRule, workspaceId?: string) => {
  const response = await apiClient.post<
    IRule,
    IAxiosResponse<{ item: ICreateRuleResponse }>
  >(
    `${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/rules`,
    shapeCollection(rule, false, 'camelToSnackCase')
  );

  return response.response.Data.item;
};

const useCreateRule = (workspaceId?: string) =>
  useMutation<ICreateRuleResponse, IAPIError, IRule>(
    [API_MUTATION_KEY.CREATE_RULE],
    (rule) => createRule(rule, workspaceId)
  );

export default useCreateRule;
