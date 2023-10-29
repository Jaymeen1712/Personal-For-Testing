import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import { IAPIError, IAxiosResponse } from '../../../../../types';
import shapeCollection from '../../../../../utills/convert-request-response';
import apiClient from '../../../../../apis/api-client';

interface IResponse {
  id: string;
  name: string;
  description: string;
  queryJson: object;
}

const createSegment = async (
  workspaceId: string,
  values: {
    environmentId: string | null;
    name: string;
    description?: string;
    queryJson: object;
  }
) => {
  const result = await apiClient.post<
    IResponse,
    IAxiosResponse<{ item: IResponse }>
  >(
    `${APIS_ROUTES.AUDIENCE_SERVICE}/${workspaceId}/segments`,
    shapeCollection(values, false, 'camelToSnackCase')
  );
  return result.response.Data.item;
};

const useCreateSegment = (workspaceId: string) =>
  useMutation<
    IResponse,
    IAPIError,
    {
      environmentId: string | null;
      name: string;
      description?: string;
      queryJson: object;
    }
  >([API_MUTATION_KEY.CREATE_SEGMENT], (values) =>
    createSegment(workspaceId, values)
  );

export default useCreateSegment;
