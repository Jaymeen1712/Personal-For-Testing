import { useQuery } from 'react-query';

import apiClient from '../../../../../apis/api-client';
import { IAxiosResponse, IPublishedRecordResponse } from '../../../../../types';
import { API_QUERY_KEY, APIS_ROUTES } from '../../../../../utills';

const recentlyPublishedRecordsDashboard = async (
  workspaceId: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string
) => {
  if (!workspaceId || !environmentId || !startDate || !endDate) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await apiClient.get<string, IAxiosResponse<any>>(
    `${APIS_ROUTES.CONTENT_SERVICE}/${workspaceId}/content-model-record`,
    {
      params: {
        environment_id: environmentId,
        skip: 0,
        limit: 10,
        sort_by: 'published_version_at',
        order_by: 'desc',
        start_date: startDate,
        end_date: endDate,
      },
    }
  );

  const PublishedRecordsResponse: IPublishedRecordResponse[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response.response.Data.map((publishedRecord: any) => {
    const publishData = {
      id: publishedRecord.id,
      title: publishedRecord.title,
      contentModelId: publishedRecord.contentModelId,
      contentModelName: publishedRecord.contentModelName,
      currentVersionId: publishedRecord.currentVersionId,
      language: publishedRecord.language,
      type: publishedRecord.type,
      contentModelFieldId: publishedRecord.contentModelFieldId,
    };
    for (const key of Object.keys(publishedRecord)) {
      //here from the backend the publishAt and publishBy comes with an id,
      // so for that reason use te endWith function to easily identify and fetch data.
      if (key.endsWith('At')) {
        // @ts-ignore
        publishData['publishedAt'] = publishedRecord[key];
      }
      if (key.endsWith('By')) {
        // @ts-ignore
        publishData['publishedBy'] = publishedRecord[key];
      }
    }
    // @ts-ignore
    PublishedRecordsResponse.push(publishData);
    return true;
  });

  return PublishedRecordsResponse;
};

const useRecentlyPublishedRecordsDashboard = (
  workspaceId: string,
  environmentId: string | null,
  startDate?: string,
  endDate?: string
) =>
  useQuery(
    [
      API_QUERY_KEY.RECENTLY_PUBLISHED_RECORDS_DASHBOARD,
      workspaceId,
      environmentId,
      startDate,
      endDate,
    ],
    () =>
      recentlyPublishedRecordsDashboard(
        workspaceId,
        environmentId,
        startDate,
        endDate
      ),
    { cacheTime: 0 }
  );

export default useRecentlyPublishedRecordsDashboard;
