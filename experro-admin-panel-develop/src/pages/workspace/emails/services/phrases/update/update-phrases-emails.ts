import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { IAPIError, IGetPhraseEmailsResponse } from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import shapeCollection from '../../../../../../utills/convert-request-response';

const updatePhrasesEmails = async (
  workspaceId: string,
  values: IGetPhraseEmailsResponse
) => {
  await apiClient.put(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/email-templates/phrase/${values.id}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );
};

const useUpdatePhrasesEmails = (workspaceId: string) =>
  useMutation<void, IAPIError, IGetPhraseEmailsResponse>(
    [API_MUTATION_KEY.UPDATE_PHRASES_EMAIL, workspaceId],
    (values) => updatePhrasesEmails(workspaceId, values)
  );

export default useUpdatePhrasesEmails;
