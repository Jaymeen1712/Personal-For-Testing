import { useQuery } from 'react-query';

import apiClient from '../../api-client';
import { IAxiosResponse, ICmsToken } from '../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';

const listCmsToken = async (workspaceId?: string, type?: string) => {
  if (!workspaceId) return undefined;

  const response = await apiClient.get<
    string,
    IAxiosResponse<{ items: ICmsToken[] }>
  >(`${APIS_ROUTES.TOKENS}/${workspaceId}/cms-tokens`, {
    params: {
      fields: 'created_at,created_by,type,valid_till,type',
      token_type: type,
    },
  });
  return response.response.Data.items;
};

const useListCmsToken = (workspaceId?: string, type?: string) =>
  useQuery([API_QUERY_KEY.TOKEN_LIST, type], () =>
    listCmsToken(workspaceId, type)
  );

export default useListCmsToken;
