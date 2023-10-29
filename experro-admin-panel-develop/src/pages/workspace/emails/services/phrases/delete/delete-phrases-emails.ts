import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import { IAPIError } from '../../../../../../types';
import shapeCollection from '../../../../../../utills/convert-request-response';

const deletePhrasesEmails = async (
  workspaceId: string,
  data: { phrasesIds: string[] | React.Key[] }
) => {
  await apiClient.post(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/email-templates/phrase/phrasesIds`,
    shapeCollection(data, false, 'camelToSnackCase')
  );
};

const useDeletePhrasesEmails = (workspaceId: string) =>
  useMutation<void, IAPIError, { phrasesIds: string[] | React.Key[] }>(
    [API_MUTATION_KEY, workspaceId],
    (data: { phrasesIds: string[] | React.Key[] }) =>
      deletePhrasesEmails(workspaceId, data)
  );

export default useDeletePhrasesEmails;
