import { useMutation } from 'react-query';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../utills';
import apiClient from '../../../api-client';
import { IAPIError } from '../../../../types';

const deletePhrasesEmails = async (workspaceId: string, phraseId: string) => {
  await apiClient.delete(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/email-templates/phrase/${phraseId}`
  );
};

const useDeletePhrasesEmails = (workspaceId: string) =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY, workspaceId],
    (phraseId) => deletePhrasesEmails(workspaceId, phraseId)
  );

export default useDeletePhrasesEmails;
