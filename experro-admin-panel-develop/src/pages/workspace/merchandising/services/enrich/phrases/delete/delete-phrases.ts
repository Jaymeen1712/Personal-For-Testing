import { useMutation } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { IAPIError } from '../../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';

const deletePhrases = async (
  phrasesId: string[],
  workspaceId: string,
  environmentId: string
) => {
  await apiClient.post(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/phrases/ids`,
    {
      phrases_ids: phrasesId,
      environment_id: environmentId,
    }
  );
};

const useDeletePhrases = (workspaceId: string, environmentId: string) =>
  useMutation<void, IAPIError, string[]>(
    [API_MUTATION_KEY.DELETE_PHRASES],
    (phrasesId) => deletePhrases(phrasesId, workspaceId, environmentId)
  );

export default useDeletePhrases;
