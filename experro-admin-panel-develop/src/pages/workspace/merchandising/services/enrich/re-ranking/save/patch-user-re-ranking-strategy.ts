import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  IPatchPhrases,
  IReRankingStrategy,
} from '../../../../../../../types';
import apiClient from '../../../../../../../apis/api-client';
import shapeCollection from '../../../../../../../utills/convert-request-response';

const patchUserReRankingStrategy = async (
  workspaceId: string,
  environmentId: string | null,
  userStrategy: IReRankingStrategy
) => {
  const result = await apiClient.patch<
    IPatchPhrases,
    IAxiosResponse<{ message: string }>
  >(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/re-ranking/set-algorithm`,
    shapeCollection(
      { ...userStrategy, environmentId: [environmentId] },
      false,
      'camelToSnackCase'
    )
  );

  return result.response.Data.message;
};

const useUpdateUserReRankingStrategy = (
  workspaceId: string,
  environmentId: string | null
) =>
  useMutation<string, IAPIError, IReRankingStrategy>(
    [API_MUTATION_KEY.UPDATE_USER_RE_RANKING_STRATEGY],
    (userStrategy) =>
      patchUserReRankingStrategy(workspaceId, environmentId, userStrategy)
  );

export default useUpdateUserReRankingStrategy;
