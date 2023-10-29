import { useQuery } from 'react-query';

import {
  FormFieldValues,
  IAPIError,
  IAxiosResponse,
} from '../../../../../../../types';
import {
  API_QUERY_KEY,
  APIS_ROUTES,
  snakeToCamel,
} from '../../../../../../../utills';
import apiClient from '../../../../../../../apis/api-client';

interface ContentField {
  index: number;
  position: number;
  id?: string;
  type?: string;
  title?: string;
  fieldName?: string;
  isRequired?: boolean;
  validations?: string;
  fields?: ContentField[];
  isRemovable?: boolean;
  isEditable?: boolean;
}

interface ListFieldResponse {
  index: number;
  id?: string;
  title?: string;
  type?: string;
  isRequired?: boolean;
  fieldName?: string;
  position: number;
  fieldProperties?: FormFieldValues;
  fields?: ContentField[];
  isRemovable?: boolean;
  isEditable?: boolean;
}

const listField = async (
  workspaceId: string,
  type: string,
  addNewType: string,
  columnSortOrder: { sortBy: string; orderBy: string },
  contentId?: string,
  filter?: string
) => {
  if (!contentId || addNewType === 'component') return [];

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: ListFieldResponse[] }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}${APIS_ROUTES.CONTENTS}/${contentId}${APIS_ROUTES.CONTENT_FIELDS}`,
    {
      params: {
        fields:
          'field_properties,is_required,type,title,id,field_name,relation_type,position,is_removable,is_editable',
        search: filter,
        sort_by: columnSortOrder.sortBy,
        order_by: columnSortOrder.orderBy,
      },
    }
  );

  // result.response.Data.items.sort(function (a, b) {
  //   return a.position - b.position;
  // });

  const listFields: ContentField[] = [];

  result.response.Data.items.forEach((fieldData, index) => {
    const validation = fieldData.fieldProperties?.validation?.map(
      (validationType) => {
        return snakeToCamel(validationType);
      }
    );

    listFields.push({
      index: index,
      id: fieldData.id,
      type: fieldData.type,
      title: fieldData.title,
      fieldName: fieldData.fieldName,
      isRequired: fieldData.isRequired,
      validations: validation?.join(','),
      fields: fieldData.fields,
      isEditable: fieldData.isEditable,
      isRemovable: fieldData.isRemovable,
      position: fieldData.position,
    });
    return undefined;
  });
  return listFields;
};

const useListField = (
  workspaceId: string,
  type: string,
  addNewType: string,
  columnSortOrder: { sortBy: string; orderBy: string },
  contentId?: string,
  filter?: string
) =>
  useQuery<ContentField[], IAPIError>(
    [API_QUERY_KEY.CONTENT_FIELDS, contentId],
    () =>
      listField(
        workspaceId,
        type,
        addNewType,
        columnSortOrder,
        contentId,
        filter
      ),
    { cacheTime: 0 }
  );

export default useListField;
