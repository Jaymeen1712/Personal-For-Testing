import { useMutation } from 'react-query';
import {
  IAPIError,
  IAxiosResponse,
  IGetAuditLogRecordResponse,
} from '../../../../../types';
import apiClient from '../../../../../apis/api-client';
import { APIS_ROUTES, API_MUTATION_KEY } from '../../../../../utills';
import shapeCollection from '../../../../../utills/convert-request-response';

interface IParams {
  selectedWorkspaceIds: string[];
  selectedEnvironmentId: string;
  selectedUserIds: string[];
  startDate: string;
  endDate: string;
  searchData: string;
  skip: number;
  skipLimit: number;
}

const getAuditLog = async (
  selectedWorkspaceIds: string[],
  selectedEnvironmentId: string,
  selectedUserIds: string[],
  startDate: string,
  endDate: string,
  searchData: string,
  skip: number,
  skipLimit: number
) => {
  const result = await apiClient.post<
    null,
    IAxiosResponse<{ items: IGetAuditLogRecordResponse[]; totalRecord: number }>
  >(
    `${APIS_ROUTES.AUDIT_LOG_SERVICE}/list`,
    shapeCollection({
      workspaceIds:
        selectedWorkspaceIds.length === 0 ? undefined : selectedWorkspaceIds,
      userIds: selectedUserIds.length === 0 ? undefined : selectedUserIds,
      environmentIds:
        selectedEnvironmentId === 'All' ? '' : selectedEnvironmentId,
      fields: [
        'description',
        'module_name',
        'environment_ids',
        'workspace_id',
        'user_id',
        'created_at',
        'collection',
      ],
      startDate: startDate,
      endDate: endDate,
      search: searchData,
      skip: searchData ? 0 : skip * skipLimit - skipLimit,
      limit: searchData ? 1000 : skipLimit,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
    {
      params: {
        fieldsToQuery:
          'id,workspace_id,user_id,module_name,description,created_by,created_at,environment_ids',
      },
    }
  );

  return result.response.Data;
};

const useGetAuditLog = () =>
  useMutation<
    { items: IGetAuditLogRecordResponse[]; totalRecord: number },
    IAPIError,
    IParams
  >(
    [API_MUTATION_KEY.GET_AUDIT_LOG],
    ({
      selectedWorkspaceIds,
      selectedEnvironmentId,
      selectedUserIds,
      startDate,
      endDate,
      searchData,
      skip,
      skipLimit,
    }) =>
      getAuditLog(
        selectedWorkspaceIds,
        selectedEnvironmentId,
        selectedUserIds,
        startDate,
        endDate,
        searchData,
        skip,
        skipLimit
      )
  );

export default useGetAuditLog;
