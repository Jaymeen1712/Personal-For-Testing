import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../utills';
import apiClient from '../../../api-client';
import { IAxiosResponse, IGetPhraseEmailsResponse } from '../../../../types';

const listPhrasesEmail = async (
  workspaceId: string,
  filter?: string,
  page?: number,
  pageSize?: number
) => {
  const response = await apiClient.get<
    void,
    IAxiosResponse<{ items: IGetPhraseEmailsResponse[] }>
  >(`${APIS_ROUTES.WORKSPACES}/${workspaceId}/email-templates/phrase`, {
    params: {
      fields: 'name, value, short_code',
      search: filter,
      // @ts-ignore
      skip: page && (page - 1) * pageSize,
      limit: pageSize,
    },
  });

  return response.response.Data.items;
};

const useListPhrasesEmail = (
  workspaceId: string,
  filter?: string,
  page?: number,
  pageSize?: number
) =>
  useQuery(
    [API_QUERY_KEY.GET_PHRASES_EMAILS, workspaceId, filter, page, pageSize],
    () => listPhrasesEmail(workspaceId, filter, page, pageSize),
    {
      cacheTime: 0,
    }
  );

export default useListPhrasesEmail;
