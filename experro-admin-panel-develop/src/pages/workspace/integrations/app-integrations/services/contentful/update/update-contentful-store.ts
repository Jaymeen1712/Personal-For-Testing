import { useMutation } from 'react-query';
import apiClient from '../../../../../../../apis/api-client';
import {
  IAPIError,
  IAxiosResponse,
  IContentfulStore,
} from '../../../../../../../types';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../../../utills';
import shapeCollection from '../../../../../../../utills/convert-request-response';

type UpdateContentfulStoreParameter = {
  workspaceId: string;
  storeId?: string;
  store?: IContentfulStore;
};

const updateContentfulStore = async (data: UpdateContentfulStoreParameter) => {
  const response = await apiClient.put<
    IContentfulStore,
    IAxiosResponse<{ message: string }>
  >(
    `${APIS_ROUTES.CONTENTFUL_ROUTE}/${data.workspaceId}/contentful/${data.storeId}`,
    shapeCollection(data.store, false, 'camelToSnackCase')
  );
  return response.response.Data.message;
};

const useUpdateContentfulStore = () => {
  return useMutation<string, IAPIError, UpdateContentfulStoreParameter>(
    [API_MUTATION_KEY.DELETE_CONTENTFUL_STORE],
    updateContentfulStore
  );
};

export default useUpdateContentfulStore;
