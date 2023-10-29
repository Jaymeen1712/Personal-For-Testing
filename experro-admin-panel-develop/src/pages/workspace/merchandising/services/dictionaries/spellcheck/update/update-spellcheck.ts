import { useMutation } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  ICreateSpellCheck,
  IRequestSpellCheck,
} from '../../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';
import shapeCollection from '../../../../../../../utills/convert-request-response';

const updateSpellcheck = async (
  values: ICreateSpellCheck,
  spellcheckId: string,
  workspaceId: string
) => {
  const response = await apiClient.patch<
    IRequestSpellCheck,
    IAxiosResponse<string>
  >(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/spell-check/${spellcheckId}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );
  return response.response.Data;
};

const useUpdateSpellCheck = (spellcheckId: string, workspaceId: string) =>
  useMutation<string, IAPIError, ICreateSpellCheck>(
    [API_MUTATION_KEY.UPDATE_SPELL_CHECK],
    (values) => updateSpellcheck(values, spellcheckId, workspaceId)
  );

export default useUpdateSpellCheck;
