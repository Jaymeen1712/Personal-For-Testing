import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import { IAPIError, IAxiosResponse, ICreateTitle } from '../../../../../types';
import shapeCollection from '../../../../../utills/convert-request-response';
import apiClient from '../../../../../apis/api-client';

const updateSegment = async (
  workspaceId: string,
  values: {
    id: string;
    name: string;
    description?: string;
    queryJson: object;
  }
) => {
  const result = await apiClient.put<
    ICreateTitle,
    IAxiosResponse<{ item: ICreateTitle }>
  >(
    `${APIS_ROUTES.AUDIENCE_SERVICE}/${workspaceId}/segments/${values.id}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );
  return result.response.Data.item;
};

const useUpdateSegment = (workspaceId: string) =>
  useMutation<
    ICreateTitle,
    IAPIError,
    {
      id: string;
      name: string;
      description?: string;
      queryJson: object;
    }
  >([API_MUTATION_KEY.UPDATE_SEGMENT], (values) =>
    updateSegment(workspaceId, values)
  );

export default useUpdateSegment;
