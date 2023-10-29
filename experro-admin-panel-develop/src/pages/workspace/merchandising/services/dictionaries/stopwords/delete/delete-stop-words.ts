import { useMutation } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { IAPIError } from '../../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';

const deleteStopWords = async (
  stopWordsIds: string[],
  workspaceId: string,
  environment: string
) => {
  await apiClient.post(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/stop-words/ids`,
    {
      stop_words_ids: stopWordsIds,
      environment_id: environment,
    }
  );
};

const useDeleteStopWords = (workspaceId: string, environment: string) =>
  useMutation<void, IAPIError, string[]>(
    [API_MUTATION_KEY.DELETE_STOP_WORDS],
    (stopWordsIds) => deleteStopWords(stopWordsIds, workspaceId, environment)
  );

export default useDeleteStopWords;
