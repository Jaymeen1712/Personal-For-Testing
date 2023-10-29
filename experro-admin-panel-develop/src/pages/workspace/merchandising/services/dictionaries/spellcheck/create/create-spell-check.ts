import { useMutation } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  ICreateSpellCheck,
} from '../../../../../../../types';
import shapeCollection from '../../../../../../../utills/convert-request-response';

const createSpellCheck = async (
  workspaceId: string,
  values: ICreateSpellCheck
) => {
  const result = await apiClient.post<
    { name: string },
    IAxiosResponse<{ item: string }>
  >(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/spell-check`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};

const useCreateSpellCheck = (workspaceId: string) =>
  useMutation<string, IAPIError, ICreateSpellCheck>(
    [API_MUTATION_KEY.CREATE_SPELL_CHECK],
    (values) => createSpellCheck(workspaceId, values)
  );

export default useCreateSpellCheck;
