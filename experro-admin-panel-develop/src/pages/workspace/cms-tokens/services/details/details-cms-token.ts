import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAPIError, IAxiosResponse, IAPIToken } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const detailsCmsToken = async (tokenId?: string, workspaceId?: string) => {
  if (!tokenId) return undefined;

  const response = await apiClient.get<
    string,
    IAxiosResponse<{ item: IAPIToken }>
  >(`${APIS_ROUTES.TOKENS}/${workspaceId}/cms-tokens/${tokenId}`, {
    params: { fields: 'valid_till,description,type' },
  });

  return response.response.Data.item;
};

const useDetailsCmsToken = (tokenId?: string, workspaceId?: string) =>
  useQuery<IAPIToken | undefined, IAPIError>(
    [API_QUERY_KEY.TOKEN_DETAIL, tokenId],
    () => detailsCmsToken(tokenId, workspaceId),
    {
      cacheTime: 0,
    }
  );

export default useDetailsCmsToken;
