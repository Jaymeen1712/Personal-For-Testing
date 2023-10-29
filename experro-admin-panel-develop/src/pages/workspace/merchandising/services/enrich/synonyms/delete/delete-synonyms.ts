import { useMutation } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { IAPIError } from '../../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';

const deleteSynonyms = async (
  synonymsIds: string[],
  workspaceId: string,
  environment: string
) => {
  await apiClient.post(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/synonyms/ids`,
    {
      synonyms_ids: synonymsIds,
      environment_id: environment,
    }
  );
};

const useDeleteSynonyms = (workspaceId: string, environment: string) =>
  useMutation<void, IAPIError, string[]>(
    [API_MUTATION_KEY.DELETE_SYNONYMS],
    (synonymsIds) => deleteSynonyms(synonymsIds, workspaceId, environment)
  );

export default useDeleteSynonyms;
