import { useMutation } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { IAPIError } from '../../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';

const deleteSpellCheck = async (
  spellCheckIds: string[],
  workspaceId: string,
  environmentId: string
) => {
  await apiClient.post(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/spell-check/ids`,
    {
      spell_check_ids: spellCheckIds,
      environment_id: environmentId,
    }
  );
};

const useDeleteSpellCheck = (workspaceId: string, environmentId: string) =>
  useMutation<void, IAPIError, string[]>(
    [API_MUTATION_KEY.DELETE_SPELL_CHECK],
    (spellCheckIds) =>
      deleteSpellCheck(spellCheckIds, workspaceId, environmentId)
  );

export default useDeleteSpellCheck;
