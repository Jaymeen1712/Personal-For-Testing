import { useMutation } from 'react-query';

import apiClient from '../../../api-client';
import {
  IAPIError,
  IReOrderLanguageInfo,
  ReOrderInternationalizationRequest,
} from '../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills/enums';
import shapeCollection from '../../../../utills/convert-request-response';

const reOrderWorkspaceLanguages = async ({
  languages,
  workspaceId,
}: IReOrderLanguageInfo) => {
  if (!workspaceId) return;

  await apiClient.put<ReOrderInternationalizationRequest>(
    `${APIS_ROUTES.WORKSPACE_LANGUAGES}/${workspaceId}/languages/reorder`,
    {
      languages: shapeCollection(languages, false, 'camelToSnackCase'),
    }
  );
};

const useReOrderWorkspaceLanguages = () =>
  useMutation<void, IAPIError, IReOrderLanguageInfo>(
    [API_MUTATION_KEY.REORDER_WORKSPACE_LANGUAGES],
    reOrderWorkspaceLanguages
  );

export default useReOrderWorkspaceLanguages;
