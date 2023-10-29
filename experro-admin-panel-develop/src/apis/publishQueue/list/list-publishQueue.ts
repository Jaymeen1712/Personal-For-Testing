import { useQuery } from 'react-query';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../utills';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import apiClient from '../../api-client';
import { IAxiosResponse, IListPublishQueueResponse } from '../../../types';
import moment from 'moment/moment';

const listPublishQueue = async (
  workspaceId: string,
  skip: number,
  skipLimit: number,
  searchData: string,
  duration: string,
  selectedFields: CheckboxValueType[],
  selectedUserIds: string[],
  selectedModelIds: string[],
  selectedEnvironments: string[],
  selectedStatus: string[]
) => {
  if (!workspaceId) return;

  const response = await apiClient.get<
    null,
    IAxiosResponse<{ items: IListPublishQueueResponse[]; totalRecord: number }>
  >(`${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/publish-queue`, {
    params: {
      search: `${searchData}`,
      start_date:
        //It's logic of converting and calculating the start date and end date.
        duration === '30 Days'
          ? moment(
              new Date(
                new Date(Date.now()).getTime() - 30 * 24 * 60 * 60 * 1000
              )
            )
              .utc()
              .format('YYYY-MM-DD')
          : duration === '10 Days'
          ? moment(
              new Date(
                new Date(Date.now()).getTime() - 10 * 24 * 60 * 60 * 1000
              )
            )
              .utc()
              .format('YYYY-MM-DD')
          : moment(
              new Date(new Date(Date.now()).getTime() - 5 * 24 * 60 * 60 * 1000)
            )
              .utc()
              .format('YYYY-MM-DD'),
      end_date: moment(new Date(new Date(Date.now()).getTime()))
        .utc()
        .format('YYYY-MM-DD'),
      skip: `${skip * skipLimit - skipLimit}`,
      limit: skipLimit,
      action: selectedStatus.join(','),
      content_model_ids: selectedModelIds.join(','),
      users_id: selectedUserIds.join(','),
      environments_id: selectedEnvironments.join(','),
      fieldsToQuery:
        selectedFields.length > 0 && selectedFields[0] !== ''
          ? `title,content_model_id,${selectedFields.join(',')}`
          : 'title,content_model_id',
    },
  });

  return response.response.Data;
};

const useListPublishQueue = (
  workspaceId: string,
  skip: number,
  skipLimit: number,
  searchData: string,
  duration: string,
  selectedFields: CheckboxValueType[],
  selectedUserIds: string[],
  selectedModelIds: string[],
  selectedEnvironments: string[],
  selectedStatus: string[]
) =>
  useQuery(
    [
      API_QUERY_KEY.LIST_PUBLISH_QUEUE,
      workspaceId,
      skip,
      skipLimit,
      searchData,
      duration,
      selectedFields,
      selectedUserIds,
      selectedModelIds,
      selectedEnvironments,
      selectedStatus,
    ],
    () =>
      listPublishQueue(
        workspaceId,
        skip,
        skipLimit,
        searchData,
        duration,
        selectedFields,
        selectedUserIds,
        selectedModelIds,
        selectedEnvironments,
        selectedStatus
      )
  );

export default useListPublishQueue;
