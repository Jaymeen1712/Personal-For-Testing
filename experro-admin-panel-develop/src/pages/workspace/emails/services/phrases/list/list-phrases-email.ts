import { useQuery } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import {
  IAxiosResponse,
  IGetPhraseEmailsResponse,
} from '../../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../../utills';

const listPhrasesEmail = async (
  workspaceId: string,
  filter?: string,
  page?: number,
  pageSize?: number
) => {
  const response = await apiClient.get<
    void,
    IAxiosResponse<{ totalCount: number; items: IGetPhraseEmailsResponse[] }>
  >(`${APIS_ROUTES.WORKSPACES}/${workspaceId}/email-templates/phrase`, {
    params: {
      fields: 'name, value, short_code',
      search: filter,
      // @ts-ignore
      skip: page && (page - 1) * pageSize,
      limit: pageSize,
    },
  });

  return response.response.Data;
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
      keepPreviousData: true,
    }
  );

export default useListPhrasesEmail;
