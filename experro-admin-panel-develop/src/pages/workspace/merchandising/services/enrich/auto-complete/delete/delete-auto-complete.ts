import { useMutation } from 'react-query';

import apiClient from '../../../../../../../apis/api-client';
import { IAPIError } from '../../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../../utills';

const deleteAutoComplete = async (
  autoCompleteIds: string[],
  workspaceId: string
) => {
  await apiClient.post(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/auto-suggester/ids`,
    {
      auto_suggester_ids: autoCompleteIds,
    }
  );
};

const useDeleteAutoComplete = (workspaceId: string) =>
  useMutation<void, IAPIError, string[]>(
    [API_MUTATION_KEY.DELETE_AUTO_COMPLETE],
    (autoCompleteIds) => deleteAutoComplete(autoCompleteIds, workspaceId)
  );

export default useDeleteAutoComplete;
