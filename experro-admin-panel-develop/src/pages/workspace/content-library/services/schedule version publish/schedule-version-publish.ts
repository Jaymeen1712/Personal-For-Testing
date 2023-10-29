import { useMutation } from 'react-query';

import { API_MUTATION_KEY, APIS_ROUTES } from '../../../../../utills';
import { IAPIError, IAxiosResponse } from '../../../../../types';
import shapeCollection from '../../../../../utills/convert-request-response';
import apiClient from '../../../../../apis/api-client';

const scheduleVersionPublish = async (
  workspaceId: string,
  contentModalId: string,
  contentModalDataId: string,
  versionId: string,
  values: { publishAt: string; environmentsId: string }
) => {
  const result = await apiClient.post<string, IAxiosResponse<{ item: string }>>(
    `${APIS_ROUTES.CONTENT_LIBRARY_SERVICE}/${workspaceId}/contents/${contentModalId}/content-model-data/${contentModalDataId}/schedule-version-publish/${versionId}`,
    shapeCollection(values, false, 'camelToSnackCase')
  );
  return result.response.Data.item;
};

const useScheduleVersionPublish = (
  workspaceId: string,
  contentModalId: string,
  contentModalDataId: string,
  versionId: string
) =>
  useMutation<string, IAPIError, { publishAt: string; environmentsId: string }>(
    [API_MUTATION_KEY.SCHEDULE_VERSION_PUBLISH],
    (values) =>
      scheduleVersionPublish(
        workspaceId,
        contentModalId,
        contentModalDataId,
        versionId,
        values
      )
  );

export default useScheduleVersionPublish;
