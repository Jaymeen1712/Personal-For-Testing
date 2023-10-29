import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import {
  IAPIError,
  IDeleteWorkspaceLanguageRequest,
} from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';

const removeWorkspaceLanguage = async ({
  languageId,
  workspaceId,
}: IDeleteWorkspaceLanguageRequest) => {
  if (!workspaceId || !languageId) return;

  await apiClient.delete(
    `${APIS_ROUTES.WORKSPACE_LANGUAGES}/${workspaceId}/languages/${languageId}`
  );
};

const useRemoveWorkspaceLanguage = () =>
  useMutation<void, IAPIError, IDeleteWorkspaceLanguageRequest>(
    [API_MUTATION_KEY.DELETE_WORKSPACE_LANGUAGES],
    removeWorkspaceLanguage
  );

export default useRemoveWorkspaceLanguage;
