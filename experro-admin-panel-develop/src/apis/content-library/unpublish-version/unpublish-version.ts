import { useMutation } from 'react-query';
import {
  FormFieldValues,
  IAPIError,
  IAxiosResponse,
  IPublishRecord,
} from '../../../types';
import { API_MUTATION_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';
import shapeCollection from '../../../utills/convert-request-response';

const unPublishVersion = async (
  workspaceId: string,
  values: IPublishRecord
) => {
  // const val = { environmentId: values.environmentId };
  const result = await apiClient.post<
    FormFieldValues,
    IAxiosResponse<{ message: string }>
  >(
    `${APIS_ROUTES.CONTENT_LIBRARY_SERVICE}/${workspaceId}/contents/${values.contentModalId}/content-model-data/${values.contentModelDataId}/unpublish-version/${values.versionId}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );
  return result.response.Data.message;
};

const useUnPublishVersion = (workspaceId: string) =>
  useMutation<string, IAPIError, IPublishRecord>(
    [API_MUTATION_KEY.UNPUBLISH_VERSION],
    (values) => unPublishVersion(workspaceId, values)
  );

export default useUnPublishVersion;
