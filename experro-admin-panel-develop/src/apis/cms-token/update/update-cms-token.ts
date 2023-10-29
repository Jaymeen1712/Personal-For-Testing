import { useMutation } from 'react-query';

import apiClient from '../../api-client';
import { IAPIError, IAxiosResponse, ICmsToken } from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import shapeCollection from '../../../utills/convert-request-response';

interface IEditAPITokenResponse {
  item: {
    id: string;
  };
}

const updateCmsToken = async (
  token: ICmsToken,
  tokenId?: string,
  workspaceId?: string
) => {
  const response = await apiClient.put<
    ICmsToken,
    IAxiosResponse<IEditAPITokenResponse>
  >(
    `${APIS_ROUTES.TOKENS}/${workspaceId}/cms-tokens/${tokenId}`,
    shapeCollection(token, false, 'camelToSnackCase')
  );

  return response.response.Data;
};

const useUpdateCmsToken = (tokenId?: string, workspaceId?: string) =>
  useMutation<IEditAPITokenResponse, IAPIError, ICmsToken>(
    [API_MUTATION_KEY.UPDATE_TOKEN],
    (token) => updateCmsToken(token, tokenId, workspaceId)
  );

export default useUpdateCmsToken;
