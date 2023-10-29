import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import {
  IAddPhrasesEmailsRequest,
  IAddPhrasesEmailsResponse,
  IAPIError,
  IAxiosResponse,
} from '../../../../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import shapeCollection from '../../../../../../utills/convert-request-response';

const addPhrasesEmails = async (
  workspaceId: string,
  values: IAddPhrasesEmailsRequest
) => {
  const response = await apiClient.post<
    string,
    IAxiosResponse<{ item: IAddPhrasesEmailsResponse }>
  >(
    `${APIS_ROUTES.WORKSPACES}/${workspaceId}/email-templates/phrase`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return response.response.Data.item;
};

const useAddPhrasesEmails = (workspaceId: string) =>
  useMutation<IAddPhrasesEmailsResponse, IAPIError, IAddPhrasesEmailsRequest>(
    [API_MUTATION_KEY.CREATE_PHRASES_EMAIL, workspaceId],
    (values) => addPhrasesEmails(workspaceId, values)
  );

export default useAddPhrasesEmails;
