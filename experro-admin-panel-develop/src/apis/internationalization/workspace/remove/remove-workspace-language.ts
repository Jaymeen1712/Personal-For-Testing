import { useMutation } from 'react-query';

import apiClient from '../../../api-client';
import { IAPIError, IDeleteWorkspaceLanguageRequest } from '../../../../types';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../utills/enums';

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
