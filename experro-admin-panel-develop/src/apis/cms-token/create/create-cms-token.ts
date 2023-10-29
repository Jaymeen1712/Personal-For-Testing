import { useMutation } from 'react-query';

import apiClient from '../../api-client';
import {
  IAPIError,
  IAxiosResponse,
  IAPIToken,
  ICmsToken,
} from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import shapeCollection from '../../../utills/convert-request-response';

export const createCmsToken = async (
  token: ICmsToken,
  workspaceId?: string,
  type?: string
) => {
  const result = await apiClient.post<
    ICmsToken,
    IAxiosResponse<{ item: IAPIToken }>
  >(
    `${APIS_ROUTES.TOKENS}/${workspaceId}/cms-tokens`,
    shapeCollection(token, false, 'camelToSnackCase')
  );
  return result.response.Data.item;
};

const useCreateCmsToken = (workspaceId?: string, type?: string) =>
  useMutation<IAPIToken, IAPIError, ICmsToken>(
    [API_MUTATION_KEY.CREATE_TOKEN],
    (token) => createCmsToken(token, workspaceId, type)
  );

export default useCreateCmsToken;
