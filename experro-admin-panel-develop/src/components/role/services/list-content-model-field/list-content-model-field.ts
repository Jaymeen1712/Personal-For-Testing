import { useQuery } from 'react-query';

import {
  ContentField,
  IAPIError,
  IAxiosResponse,
  ListFieldResponse,
} from '../../../../types';
import { API_QUERY_KEY, APIS_ROUTES, snakeToCamel } from '../../../../utills';
import apiClient from '../../../../apis/api-client';

const listContentModelField = async (
  workspaceId: string,
  contentId?: string
) => {
  if (!contentId) return [];

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: ListFieldResponse[] }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}${APIS_ROUTES.CONTENTS}/${contentId}${APIS_ROUTES.PUBLIC_CONTENT_FIELDS}`,
    {
      params: {
        fields: 'title,id,field_name',
      },
    }
  );

  result.response.Data.items.forEach((fieldData) => {
    // @ts-ignore
    fieldData.fieldName = snakeToCamel(fieldData.fieldName);
  });

  return result.response.Data.items;
};

const useListContentModelField = (workspaceId: string, contentId?: string) =>
  useQuery<ContentField[], IAPIError>(
    [API_QUERY_KEY.ALL_CONTENT_FIELDS, contentId],
    () => listContentModelField(workspaceId, contentId),
    { cacheTime: 0 }
  );

export default useListContentModelField;
