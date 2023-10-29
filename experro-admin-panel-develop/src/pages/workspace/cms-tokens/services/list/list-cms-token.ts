import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAxiosResponse, ICmsToken } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const listCmsToken = async (
  workspaceId: string,
  page: number,
  pageSize: number,
  type?: string,
  orderBy?: string,
  sortBy?: string
) => {
  if (!workspaceId) return undefined;

  const response = await apiClient.get<
    string,
    IAxiosResponse<{ items: ICmsToken[]; totalCount: number }>
  >(`${APIS_ROUTES.TOKENS}/${workspaceId}/cms-tokens`, {
    params: {
      fields: 'created_at,created_by,type,valid_till,type',
      skip: (page - 1) * pageSize,
      limit: pageSize,
      token_type: type,
      order_by: orderBy,
      sort_by: sortBy,
    },
  });
  return response.response.Data;
};

const useListCmsToken = (
  workspaceId: string,
  page: number,
  pageSize: number,
  type?: string,
  orderBy?: string,
  sortBy?: string
) =>
  useQuery([API_QUERY_KEY.TOKEN_LIST, page, pageSize, type], () =>
    listCmsToken(workspaceId, page, pageSize, type, orderBy, sortBy)
  );

export default useListCmsToken;
