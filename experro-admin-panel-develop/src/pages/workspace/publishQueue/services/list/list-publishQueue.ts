import { useQuery } from 'react-query';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import moment from 'moment/moment';

import apiClient from '../../../../../apis/api-client';
import {
  IAxiosResponse,
  IListPublishQueueResponse,
  IPublishQueueDataType,
} from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
}

const listPublishQueue = async (
  workspaceId: string,
  skip: number,
  skipLimit: number,
  searchData: string,
  selectedFields: CheckboxValueType[],
  selectedUserIds: string[],
  selectedModelIds: string[],
  selectedEnvironments: string | null,
  selectedStatus: string[],
  startDate?: string,
  endDate?: string,
  environmentId?: string | null
) => {
  if (!workspaceId || !environmentId) {
    return;
  } else {
    const publishQueueData: IPublishQueueDataType[] = [];
    const listUserObject: { [k: string]: string } = {};

    const response = await apiClient.get<
      null,
      IAxiosResponse<{
        items: IListPublishQueueResponse[];
        totalRecord: number;
      }>
    >(`${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/publish-queue`, {
      params: {
        search: `${searchData}`,
        start_date: startDate,
        end_date: endDate,
        skip: `${skip * skipLimit - skipLimit}`,
        limit: skipLimit,
        action: selectedStatus.join(','),
        content_model_ids: selectedModelIds.join(','),
        users_id: selectedUserIds.join(','),
        environments_id: selectedEnvironments,
        fieldsToQuery:
          selectedFields.length > 0 && selectedFields[0] !== ''
            ? `title,content_model_id,content_model_name,${selectedFields.join(
                ','
              )}`
            : 'title,content_model_id,content_model_name',
      },
    });

    const listAllUser = await apiClient.get<
      null,
      IAxiosResponse<{ items: IUser[] }>
    >(`${APIS_ROUTES.USERS_ALL}`, {
      params: { fields: 'first_name,last_name' },
    });

    if (listAllUser && listAllUser.response.Data.items.length > 0) {
      listAllUser.response.Data.items.map((item) => {
        return (listUserObject[item.id] = `${item.firstName} ${item.lastName}`);
      });
    }

    if (response && response.response.Data.items.length > 0) {
      for (let i = 0; i <= response.response.Data.items.length - 1; i++) {
        publishQueueData.push({
          key: response.response.Data.items[i].id,
          id: response.response.Data.items[i].id,
          title: response.response.Data.items[i].title,
          languages: response.response.Data.items[i].languages,
          // @ts-ignore
          environments: response.response.Data.items[i].environments,
          contentModelVersionName:
            response.response.Data.items[i].contentModelVersionName,
          // @ts-ignore
          createdBy: response.response.Data.items[i].createdBy
            ? // @ts-ignore
              listUserObject[response.response.Data.items[i].createdBy]
            : '-',
          createdAt: response.response.Data.items[i].createdAt
            ? moment(response.response.Data.items[i].createdAt)
                .local()
                .format('DD MMM YYYY,LT')
            : '-',
          action: response.response.Data.items[i].action,
          contentModelName: response.response.Data.items[i].contentModelName
            ? response.response.Data.items[i].contentModelName
            : '-',
        });
      }
    }

    return {
      response: publishQueueData,
      totalCount: response.response.Data.totalRecord,
    };
  }
};

const useListPublishQueue = (
  workspaceId: string,
  skip: number,
  skipLimit: number,
  searchData: string,
  selectedFields: CheckboxValueType[],
  selectedUserIds: string[],
  selectedModelIds: string[],
  selectedEnvironments: string | null,
  selectedStatus: string[],
  startDate?: string,
  endDate?: string,
  environmentId?: string | null
) =>
  useQuery(
    [
      API_QUERY_KEY.LIST_PUBLISH_QUEUE,
      workspaceId,
      skip,
      skipLimit,
      searchData,
      selectedFields,
      selectedUserIds,
      selectedModelIds,
      selectedEnvironments,
      selectedStatus,
      startDate,
      endDate,
      environmentId,
    ],
    () =>
      listPublishQueue(
        workspaceId,
        skip,
        skipLimit,
        searchData,
        selectedFields,
        selectedUserIds,
        selectedModelIds,
        selectedEnvironments,
        selectedStatus,
        startDate,
        endDate,
        environmentId
      ),
    { cacheTime: 0 }
  );

export default useListPublishQueue;
