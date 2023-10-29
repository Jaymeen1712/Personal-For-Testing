import { useMutation } from 'react-query';
import apiClient from '../../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IContentfulStore,
  ICreateContentfulStore,
  ICreateContentfulStoreResponse,
} from '../../../../../../../types';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../../../utills';
import shapeCollection from '../../../../../../../utills/convert-request-response';

const createContentfulStore = async (
  data: IContentfulStore,
  workspaceId: string
) => {
  const response = await apiClient.post<
    ICreateContentfulStore,
    IAxiosResponse<ICreateContentfulStoreResponse>
  >(
    `${APIS_ROUTES.CONTENTFUL_ROUTE}/${workspaceId}/contentful`,
    shapeCollection(data, false, 'camelToSnackCase')
  );

  return response.response.Data;
};

const useCreateContentfulStore = (workspaceId: string) =>
  useMutation<ICreateContentfulStoreResponse, IAPIError, IContentfulStore>(
    [API_MUTATION_KEY.CREATE_CONTENTFUL_STORE],
    (data) => createContentfulStore(data, workspaceId)
  );

export default useCreateContentfulStore;
