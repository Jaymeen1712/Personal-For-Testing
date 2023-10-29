// @ts-nocheck
import { useQuery } from 'react-query';

import { IAPIError, IAxiosResponse, ListRecordResponse } from '../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';
import apiClient from '../../api-client';

const getRelationRecordList = async (
  workspaceId: string,
  relationFieldListData: []
) => {
  if (relationFieldListData < 1) return [];
  const resultData = await Promise.allSettled(
    relationFieldListData.map(async (item) => {
      const tempObject = {};
      const result = await apiClient.get<
        null,
        IAxiosResponse<{ items: ListRecordResponse[] }>
      >(
        `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}${APIS_ROUTES.CONTENTS}/${item.destinationContentModalId}/${APIS_ROUTES.CONTENT_MODAL_DATA}`,
        {
          params: {
            fieldsToQuery:
              'id,title,language,created_by,status,current_version_id,modified_by,content_model_id',
            search: '',
          },
        }
      );
      tempObject['editValue'] = item.editValue;
      tempObject['relationType'] = item.relationType;
      tempObject['title'] = item.title;
      tempObject['internalName'] = item.name;
      tempObject['contentModalId'] = item.destinationContentModalId;
      tempObject['values'] = result.response.Data.items;
      return tempObject;
    })
  );
  return resultData;
};

const useGetRelationRecordList = (
  workspaceId: string,
  relationFieldListData: []
) => {
  const data = useQuery<ListRecordResponse[], IAPIError>(
    [API_QUERY_KEY.GET_RELATION_FIELD_LIST],
    () => getRelationRecordList(workspaceId, relationFieldListData),
    {
      cacheTime: 0,
    }
  );
  if (data.status) {
    // eslint-disable-next-line no-self-assign
    data['status'] = data.status;
    // eslint-disable-next-line no-self-assign
    data['data'] = data.data;
  }
  return data;
};

export default useGetRelationRecordList;
