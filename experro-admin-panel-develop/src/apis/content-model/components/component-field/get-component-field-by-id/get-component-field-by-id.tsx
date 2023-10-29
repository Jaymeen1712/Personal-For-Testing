import { useQuery } from 'react-query';

import apiClient from '../../../../api-client';
import { IAPIError, IAxiosResponse, IField } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const getComponentFieldById = async (
  addNewType: string,
  workspaceId?: string,
  contentModalId?: string,
  id?: string
) => {
  if (!workspaceId || !contentModalId || !id || addNewType !== 'component') {
    return {};
  }
  const result = await apiClient.get<null, IAxiosResponse<{ item: IField }>>(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/components/${contentModalId}/component-fields/${id}`,
    {
      params: { fields: 'field_properties' },
    }
  );

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

const useGetComponentFieldById = (
  addNewType: string,
  workspaceId?: string,
  contentModalId?: string,
  id?: string
) =>
  useQuery<IField, IAPIError>(
    [API_QUERY_KEY.GET_FIELD_BY_ID, id],
    () => getComponentFieldById(addNewType, workspaceId, contentModalId, id),
    {
      cacheTime: 0,
    }
  );

export default useGetComponentFieldById;
