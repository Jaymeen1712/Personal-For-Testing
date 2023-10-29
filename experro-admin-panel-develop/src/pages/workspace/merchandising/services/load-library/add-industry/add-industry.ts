import { useMutation } from 'react-query';

import apiClient from '../../../../../../apis/api-client';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../../utills';
import {
  IAddIndustry,
  IAPIError,
  IAxiosResponse,
} from '../../../../../../types';
import shapeCollection from '../../../../../../utills/convert-request-response';

const addIndustrySpecific = async (
  workspaceId: string,
  values: IAddIndustry
) => {
  const result = await apiClient.post<
    { name: string },
    IAxiosResponse<{ item: string }>
  >(
    `${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/industries/categories`,
    shapeCollection(values, false, 'camelToSnackCase')
  );

  return result.response.Data.item;
};

const useAddIndustrySpecific = (workspaceId: string) =>
  useMutation<string, IAPIError, IAddIndustry>(
    [API_MUTATION_KEY.ADD_INDUSTRY],
    (values) => addIndustrySpecific(workspaceId, values)
  );

export default useAddIndustrySpecific;
