// @ts-nocheck
import { useQuery } from 'react-query';

import { IAPIError, IAxiosResponse } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';
import apiClient from '../../../../../apis/api-client';
import { ListRecordResponse } from '../../../../../types';

const getRecordList = async (
  workspaceId: string,
  skip: number,
  skipLimit: number,
  userList: string[],
  selectedVersionId: string,
  selectedStatus: string,
  contentModalId?: string,
  searchData?: string,
  columnSortOrder: { sortBy: string; orderBy: string }
) => {
  if (!contentModalId) return [];
  const queryParam = {
    fieldsToQuery:
      'id,title,language,created_by,status,current_version_id,modified_by,modified_at,environment,created_at,page_slug,published_version_id',
    search: `${searchData}`,
    skip: `${searchData ? 0 : `${skip * skipLimit - skipLimit}`}`,
    limit: `${searchData ? 1000 : skipLimit}`,
    users_id: userList.toString(),
    environment_id: selectedVersionId,
    status: selectedStatus,
  };
  if (columnSortOrder) {
    queryParam['sort_by'] = columnSortOrder.sortBy;
    queryParam['order_by'] = columnSortOrder.orderBy;
  }
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: ListRecordResponse[]; totalCount: number }>
  >(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}${APIS_ROUTES.CONTENTS}/${contentModalId}/${APIS_ROUTES.CONTENT_MODAL_DATA}`,
    {
      params: queryParam,
    }
  );

  return result.response.Data;
};

const useGetRecordList = (
  workspaceId: string,
  skip: number,
  skipLimit: number,
  userList: string[],
  contentModalId?: string,
  searchData?: string,
  selectedVersionId: string,
  selectedStatus: string,
  columnSortOrder: { sortBy: string; orderBy: string }
) =>
  useQuery<IAPIError>(
    [API_QUERY_KEY.RECORD_TABLE_LIST, contentModalId, searchData],
    () =>
      getRecordList(
        workspaceId,
        skip,
        skipLimit,
        userList,
        selectedVersionId,
        selectedStatus,
        contentModalId,
        searchData,
        columnSortOrder
      ),
    {
      cacheTime: 0,
    }
  );

export default useGetRecordList;
