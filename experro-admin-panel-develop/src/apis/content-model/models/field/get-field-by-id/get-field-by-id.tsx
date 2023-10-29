import { useQuery } from 'react-query';

import apiClient from '../../../../api-client';
import { IAPIError, IAxiosResponse, IField } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const getFieldById = async (
  addNewType: string,
  workspaceId?: string,
  contentModalId?: string,
  id?: string
) => {
  if (!workspaceId || !contentModalId || !id || addNewType === 'component') {
    return {};
  }
  const result = await apiClient.get<null, IAxiosResponse<{ item: IField }>>(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/contents/${contentModalId}/content-fields/${id}`,
    {
      params: { fields: 'field_properties,relation_type' },
    }
  );

  if (result.response.Data.item.fieldProperties) {
    result.response.Data.item.fieldProperties['fieldName'] =
      result.response.Data.item.title;
  }

  if (result.response.Data.item.type === 'relation') {
    result.response.Data.item.fieldProperties = {
      fieldName: result.response.Data.item.title,
      relationSelect: result.response.Data.item.destinationContentModelId,
      destinationFieldName: result.response.Data.item.destinationField?.title,
      validation: result.response.Data.item.fieldProperties?.validation,
    };
    return result.response.Data.item;
  }
  return result.response.Data.item;
};

const useGetFieldById = (
  addNewType: string,
  workspaceId?: string,
  contentModalId?: string,
  id?: string
) =>
  useQuery<IField, IAPIError>(
    [API_QUERY_KEY.GET_FIELD_BY_ID, id, contentModalId],
    () => getFieldById(addNewType, workspaceId, contentModalId, id),
    {
      cacheTime: 0,
    }
  );

export default useGetFieldById;
