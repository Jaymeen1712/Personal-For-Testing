import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IUpdateRuleRequest,
} from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import shapeCollection from '../../../../../../utills/convert-request-response';

const updateRule = async (rule: IUpdateRuleRequest, workspaceId?: string) => {
  const updateRuleData = {
    versionId: rule.versionId,
    // language: 'en-us',
    dynamicFieldsData: rule,
  };

  const response = await apiClient.put<
    IUpdateRuleRequest,
    IAxiosResponse<{ message: string }>
  >(
    `${APIS_ROUTES.MERCHANDISING_SERVICE}/${workspaceId}/contents/${rule.contentModelId}/content-model-data/${rule.contentModelDataId}/rules-data`,
    shapeCollection(updateRuleData, false, 'camelToSnackCase')
  );

  return response.response.Data.message;
};

const useUpdateRule = (workspaceId?: string) =>
  useMutation<string | undefined, IAPIError, IUpdateRuleRequest>(
    [API_MUTATION_KEY.UPDATE_RULE],
    (rule) => updateRule(rule, workspaceId)
  );

export default useUpdateRule;
