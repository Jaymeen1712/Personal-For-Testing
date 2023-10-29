import { useQuery } from 'react-query';

import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../api-client';
import { FormFieldValues, IAxiosResponse } from '../../../../../types';

interface ListFieldResponse {
  index: number;
  position: number;
  id?: string;
  title?: string;
  type?: string;
  isRequired?: boolean;
  fieldName?: string;
  fieldProperties?: FormFieldValues;
  isRemovable?: boolean;
  isEditable?: boolean;
}

interface ComponentField {
  index: number;
  position: number;
  id?: string;
  type?: string;
  title?: string;
  fieldName?: string;
  isRequired?: boolean;
  validations?: string;
  isRemovable?: boolean;
  isEditable?: boolean;
}

const listComponentFields = async (
  workspaceId: string,
  type: string,
  addNewType: string,
  contentId?: string,
  filter?: string
) => {
  if (!contentId || addNewType !== 'component') return [];

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: ListFieldResponse[] }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}${APIS_ROUTES.COMPONENTS}/${contentId}${APIS_ROUTES.COMPONENT_FIELDS}`,
    {
      params: {
        fields:
          'field_properties,is_required,type,title,id,field_name,is_removable,is_editable,position',
        search: filter,
      },
    }
  );
  const listComponentFields: ComponentField[] = [];

  result.response.Data.items.map((fieldData, index) => {
    listComponentFields.push({
      index: index,
      position: fieldData.position,
      id: fieldData.id,
      type: fieldData.type,
      title: fieldData.title,
      fieldName: fieldData.fieldName,
      isRequired: fieldData.isRequired,
      isEditable: fieldData.isEditable,
      isRemovable: fieldData.isRemovable,
    });
    return undefined;
  });
  return listComponentFields;
};

const useListComponentFields = (
  workspaceId: string,
  type: string,
  addNewType: string,
  contentId?: string,
  filter?: string
) =>
  useQuery([API_QUERY_KEY.COMPONENT_FIELDS, contentId], () =>
    listComponentFields(workspaceId, type, addNewType, contentId, filter)
  );

export default useListComponentFields;
