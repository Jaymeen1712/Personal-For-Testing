import { useMutation } from 'react-query';
import { IAPIError, IAxiosResponse } from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';
import shapeCollection from '../../../utills/convert-request-response';

const cloneVersion = async (
  workspaceId: string,
  contentModalId: string,
  contentModalDataId: string,
  values: { versionId?: string; versionNo: number; versionName: string }
) => {
  const result = await apiClient.post<
    string,
    IAxiosResponse<{ item: { id: string } }>
  >(
    `${APIS_ROUTES.CONTENT_LIBRARY_SERVICE}/${workspaceId}/contents/${contentModalId}/content-model-data/${contentModalDataId}/add-version`,
    shapeCollection(values, false, 'camelToSnackCase')
  );
  return result.response.Data.item;
};

const useCloneVersion = (
  workspaceId: string,
  contentModalId: string,
  contentModalDataId: string
) =>
  useMutation<
    { id: string },
    IAPIError,
    { versionId?: string; versionNo: number; versionName: string }
  >([API_MUTATION_KEY.CLONE_VERSION], (values) =>
    cloneVersion(workspaceId, contentModalId, contentModalDataId, values)
  );

export default useCloneVersion;
