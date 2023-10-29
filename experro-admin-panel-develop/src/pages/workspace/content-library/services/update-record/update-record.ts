import { useMutation } from 'react-query';

import {
  IAPIError,
  FormFieldValues,
  IAxiosResponse,
  IAPIToken,
} from '../../../../../types';
import apiClient from '../../../../../apis/api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../utills';
import shapeCollection from '../../../../../utills/convert-request-response';

const updateRecord = async (
  workspaceId: string,
  contentModelId: string | undefined,
  values: FormFieldValues,
  contentModelDataId?: string,
  versionId?: string
) => {
  const { environmentId, ...rest } = values;
  const result = await apiClient.put<
    FormFieldValues,
    IAxiosResponse<{ item: IAPIToken }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/contents/${contentModelId}/content-model-data/${contentModelDataId}/update-record`,
    shapeCollection(rest, false, 'camelToSnackCase'),
    {
      params: {
        version_id: versionId,
        environment_id: environmentId,
      },
    }
  );

  return result.response.Data.item;
};
const useUpdateRecord = (
  workspaceId: string,
  contentModelId: string | undefined,
  contentModelDataId?: string,
  versionId?: string
) =>
  useMutation<IAPIToken, IAPIError, FormFieldValues>(
    [API_MUTATION_KEY.CONTENT_MODEL_RECORD_UPDATE],
    (values) =>
      updateRecord(
        workspaceId,
        contentModelId,
        values,
        contentModelDataId,
        versionId
      )
  );

export default useUpdateRecord;
