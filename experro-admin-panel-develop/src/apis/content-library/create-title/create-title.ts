import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import { IAPIError, IAxiosResponse, ICreateTitle } from '../../../types';
import shapeCollection from '../../../utills/convert-request-response';
import apiClient from '../../api-client';

const createTitle = async (
  workspaceId: string,
  values: { title?: string; contentModalId: string; pageSlug?: string }
) => {
  const result = await apiClient.post<
    ICreateTitle,
    IAxiosResponse<{ item: ICreateTitle }>
  >(
    `${APIS_ROUTES.CONTENT_LIBRARY_SERVICE}/${workspaceId}/contents/${values.contentModalId}/content-model-data`,
    shapeCollection(values, false, 'camelToSnackCase')
  );
  return result.response.Data.item;
};

const useCreateTitle = (workspaceId: string) =>
  useMutation<
    ICreateTitle,
    IAPIError,
    { title?: string; contentModalId: string; pageSlug?: string }
  >([API_MUTATION_KEY.CREATE_TITLE], (values) =>
    createTitle(workspaceId, values)
  );

export default useCreateTitle;
