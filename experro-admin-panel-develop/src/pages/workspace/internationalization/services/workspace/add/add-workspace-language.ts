import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import {
  CreateLanguageRequest,
  IAPIError,
  ICreateLanguageRequest,
} from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';

const addWorkspaceLanguage = async ({
  languageId,
  workspaceId,
}: CreateLanguageRequest) => {
  if (!workspaceId) return;

  await apiClient.post<ICreateLanguageRequest>(
    `${APIS_ROUTES.WORKSPACE_LANGUAGES}/${workspaceId}/languages`,
    {
      language_id: languageId,
    }
  );
};

const useAddWorkspaceLanguage = () =>
  useMutation<void, IAPIError, CreateLanguageRequest>(
    [API_MUTATION_KEY.ADD_WORKSPACE_LANGUAGES],
    addWorkspaceLanguage
  );

export default useAddWorkspaceLanguage;
