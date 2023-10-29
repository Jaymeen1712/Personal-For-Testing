import { useQuery } from 'react-query';

import {
  FormFieldValues,
  IAPIError,
  IAxiosResponse,
} from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';

interface ContentField {
  id?: string;
  type?: string;
  title?: string;
  fieldName?: string;
  isRequired?: boolean;
  validations?: string;
  isEditable?: boolean;
  isDataEditable?: boolean;
  fields?: ContentField[];
}

interface ListFieldResponse {
  id?: string;
  title?: string;
  type?: string;
  isRequired?: boolean;
  fieldName?: string;
  fieldProperties?: FormFieldValues;
  fields?: ContentField[];
  isSystemField: boolean;
}

const listField = async (
  workspaceId: string,
  type: string,
  contentId?: string
) => {
  if (!contentId || type === 'component') return [];

  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: ListFieldResponse[] }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}${APIS_ROUTES.CONTENTS}/${contentId}${APIS_ROUTES.CONTENT_FIELDS}`,
    {
      params: {
        fields:
          'field_properties,is_required,type,title,id,field_name,relation_type,position,destination_content_model_id,is_editable,is_data_editable,is_system_field',
      },
    }
  );

  return result.response.Data.items;
};

const useFieldList = (workspaceId: string, type: string, contentId?: string) =>
  useQuery<ContentField[], IAPIError>(
    [API_QUERY_KEY.CONTENT_FIELDS, contentId],
    () => listField(type, workspaceId, contentId),
    {
      cacheTime: 0,
    }
  );

export default useFieldList;
