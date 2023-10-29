import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import {
  IAPIError,
  IAxiosResponse,
  ICreateTitle,
} from '../../../../../../types';
import shapeCollection from '../../../../../../utills/convert-request-response';
import apiClient from '../../../../../../apis/api-client';

interface CreateFacet {
  id?: string | undefined;
  category: string;
  provider: string;
  isEnabled: boolean;
  facets: {
    sortOrder: number;
    isEnabled: boolean;
    type?: string | undefined;
    displayName?: string | undefined;
    facetType?: string | undefined;
    facetName?: string | undefined;
  }[];
  storeId?: string | undefined;
}
const createFacet = async (
  workspaceId: string,
  environmentId: string,
  values: CreateFacet
) => {
  const result = await apiClient.post<
    ICreateTitle,
    IAxiosResponse<{ item: ICreateTitle }>
  >(
    `${APIS_ROUTES.ECOMMERCE_SERVICE}/${workspaceId}/facets`,
    shapeCollection(values, false, 'camelToSnackCase'),
    {
      params: { environmentId: environmentId },
    }
  );
  return result.response.Data.item;
};

const useCreateFacet = (workspaceId: string, environmentId: string) =>
  useMutation<ICreateTitle, IAPIError, CreateFacet>(
    [API_MUTATION_KEY.CREATE_FACET],
    (values) => createFacet(workspaceId, environmentId, values)
  );

export default useCreateFacet;
