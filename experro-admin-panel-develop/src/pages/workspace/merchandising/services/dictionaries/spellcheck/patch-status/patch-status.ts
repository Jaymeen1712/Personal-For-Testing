import { useMutation } from 'react-query';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  IPatchSpellCheck,
} from '../../../../../../../types';
import apiClient from '../../../../../../../apis/api-client';
import shapeCollection from '../../../../../../../utills/convert-request-response';

const patchSpellCheckStatus = async (
  statusData: IPatchSpellCheck,
  workspaceId?: string
) => {
  const response = await apiClient.patch<
    IPatchSpellCheck,
    IAxiosResponse<{ message: string }>
  >(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/spell-check/update-status`,
    shapeCollection(statusData, false, 'camelToSnackCase')
  );

  return response.response.Data.message;
};

const usePatchStatus = (workspaceId: string) =>
  useMutation<string, IAPIError, IPatchSpellCheck>(
    [API_MUTATION_KEY.PATCH_SPELL_CHECK_STATUS],
    (statusData) => patchSpellCheckStatus(statusData, workspaceId)
  );

export default usePatchStatus;
