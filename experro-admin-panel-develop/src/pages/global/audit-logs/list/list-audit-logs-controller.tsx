import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import moment from 'moment/moment';

import useGetAuditLog from '../services/list';
import { PAGE_SIZE } from '../../../../utills';
import useError from '../../../../hooks/error/error';
import useGetAllUser from '../services/list-all-user';
import useGetAllEnvironments from '../services/list-all-environments';
import useGetAllWorkspaces from '../services/list-all-workspaces';
import { IListAllUser, IWorkspace } from '../../../../types';

interface IUseListAuditLogsController {
  startDate: string;
  endDate: string;
}

// export interface IListAuditLogsDataType {
//   description: string;
//   moduleName: string;
//   collection: string;
//   workspace: string;
//   environmentIds: string[];
//   userId: string;
//   createdAt: string;
// }

const useListAuditLogsController = ({
  startDate,
  endDate,
}: IUseListAuditLogsController) => {
  const { t } = useTranslation();
  const getAllWorkspaces = useGetAllWorkspaces();
  const getAuditLog = useGetAuditLog();
  const getAllUser = useGetAllUser();
  const getAllEnvironments = useGetAllEnvironments();

  // const [columns, setColumns] = useState<any>([]);
  const [searchData, setSearchData] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedWorkspaceIds, setSelectedWorkspaceIds] = useState<string[]>(
    []
  );
  const [selectedEnvironmentId, setSelectedEnvironmentId] =
    useState<string>('All');

  // const [userPreference, setUserPreference] = useState<string[]>([]);
  const [skip, setSkip] = useState(1);
  const [skipLimit, setSkipLimit] = useState(PAGE_SIZE);

  const [workspacesList, setWorkspacesList] = useState<
    IWorkspace[] | undefined
  >([]);
  const [workspaceFilterValue, setWorkspaceFilterValue] = useState('');
  const workspaceFilterRef = useRef();
  const workspaceFilterInputRef = useRef();

  const [userList, setUserList] = useState<IListAllUser[] | undefined>([]);
  const [userFilterValue, setUserFilterValue] = useState('');
  const userFilterRef = useRef();
  const userFilterInputRef = useRef();

  useError({
    mutation: getAuditLog,
    entity: t('common.labels.audit_logs'),
    dependentEntities: t('common.labels.audit_logs'),
  });

  // useEffect(() => {
  //   setUserPreference(['module', 'environment', 'user', 'dateTime']);
  //   columnValue(['module', 'environment', 'user', 'dateTime']);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    // if (userPreference.length > 0) {
    //   columnValue(userPreference);
    // }
    if (startDate && endDate) {
      getAuditLog.mutate({
        selectedWorkspaceIds,
        selectedEnvironmentId,
        selectedUserIds,
        startDate,
        endDate,
        searchData,
        skip,
        skipLimit,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedWorkspaceIds,
    selectedEnvironmentId,
    selectedUserIds,
    skip,
    skipLimit,
  ]);

  useEffect(() => {
    if (skip !== 1) {
      setSkip(1);
    } else if (startDate && endDate) {
      getAuditLog.mutate({
        selectedWorkspaceIds,
        selectedEnvironmentId,
        selectedUserIds,
        startDate,
        endDate,
        searchData,
        skip,
        skipLimit,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  // useEffect(() => {
  //   const array: IListAuditLogsDataType[] = [];
  //   if (getAuditLog.isSuccess) {
  //     if (getAuditLog.data.items) {
  //       getAuditLog.data.items.map((item, index) => {
  //         const environmentIds =
  //           item.environmentIds !== 'null'
  //             ? JSON.parse(item.environmentIds)
  //             : [];
  //
  //         const workspace =
  //           item.workspaceId !== 'null'
  //             ? getAllWorkspaces?.data?.find(
  //                 (workspace) => workspace.id === item.workspaceId
  //               )?.name
  //             : '-';
  //
  //         const user = getAllUser.data?.find((user) => user.id === item.userId);
  //
  //         return array.push({
  //           description: item.description,
  //           collection: item.collection ? item.collection : '-',
  //           workspace: workspace ? workspace : '-',
  //           moduleName: item.moduleName,
  //           environmentIds:
  //             environmentIds && environmentIds.length > 0
  //               ? environmentIds.join(', ')
  //               : '-',
  //           userId: `${user ? `${user.firstName} ${user.lastName}` : '-'}`,
  //           createdAt: moment(item.createdAt).local().format('DD MMM, YYYY LT'),
  //         });
  //       });
  //     }
  //     setColumnData([...array]);
  //     setTotalRecordCount(getAuditLog.data.totalRecord);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [getAuditLog.isSuccess, getAuditLog.data]);

  useEffect(() => {
    if (
      getAllWorkspaces.isSuccess &&
      getAllWorkspaces.data &&
      getAllWorkspaces.data.length > 0
    ) {
      setWorkspacesList([...getAllWorkspaces.data]);
    }
  }, [getAllWorkspaces.isSuccess, getAllWorkspaces.data]);

  useEffect(() => {
    if (getAllUser.isSuccess && getAllUser.data && getAllUser.data.length > 0) {
      setUserList([...getAllUser.data]);
    }
  }, [getAllUser.isSuccess, getAllUser.data]);

  const onInputChange = debounce((value) => {
    setSearchData(value.trim());
    if (skip !== 1) {
      setSkip(1);
    } else {
      getAuditLog.mutate({
        selectedWorkspaceIds,
        selectedEnvironmentId,
        selectedUserIds,
        startDate,
        endDate,
        searchData: value.trim(),
        skip,
        skipLimit,
      });
    }
  }, 500);

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.logs'),
        dataIndex: 'description',
        key: 'description',
        width: 'auto',
        render: (description: string) => (
          <div
            className={`ant-row ant-row-middle ant-row-no-wrap ant-row-space-between table-text-button`}>
            <div className="table-text">
              <div className="with-pixel">
                {description ? description : '-'}
              </div>
            </div>
          </div>
        ),
      },
      {
        title: t('common.labels.collection'),
        dataIndex: 'collection',
        key: 'collection',
        width: '13%',
        render: (collection: string) => (
          <div className="table-text">{collection ? collection : '-'}</div>
        ),
      },
      {
        title: t('common.labels.workspace'),
        dataIndex: 'workspaceId',
        key: 'workspaceId',
        width: '10%',
        render: (workspaceId: string) => (
          <div className="table-text">
            {workspaceId && getAllWorkspaces.data
              ? getAllWorkspaces.data.find(
                  (workspace) => workspace.id === workspaceId
                )?.name
              : '-'}
          </div>
        ),
      },
      {
        title: t('common.labels.module'),
        dataIndex: 'moduleName',
        key: 'moduleName',
        width: '11%',
        render: (moduleName: string) => (
          <div className="table-text">{moduleName ? moduleName : '-'}</div>
        ),
      },
      {
        title: t('common.labels.environment'),
        dataIndex: 'environmentIds',
        key: 'environmentIds',
        width: '14%',
        render: (environmentIds: string) => (
          <div className="table-text">
            {environmentIds !== 'null'
              ? environmentIds && JSON.parse(environmentIds).length > 0
                ? JSON.parse(environmentIds).join(', ')
                : '-'
              : '-'}
          </div>
        ),
      },
      {
        title: t('common.labels.user'),
        dataIndex: 'userId',
        key: 'userId',
        width: '10%',
        render: (userId: string) => {
          const user = getAllUser.data?.find((user) => user.id === userId);
          return <div className="table-text">{user ? user.name : '-'}</div>;
        },
      },
      {
        title: t('common.labels.date_and_time'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: '17%',
        render: (createdAt: string) => (
          <div className="table-text">
            {createdAt
              ? moment(createdAt).local().format('DD MMM, YYYY LT')
              : '-'}
          </div>
        ),
      },
    ],
    [t, getAllUser.data, getAllWorkspaces.data]
  );

  const onUserChange = (userIds: string[]) => {
    if (userIds.length > 1 && userIds.indexOf('All') !== -1) {
      userIds.splice(userIds.indexOf('All'), 1);
    }
    setSelectedUserIds(userIds);
    setSkip(1);
    setUserFilterValue('');
    setUserList(getAllUser.data);
    //@ts-ignore
    userFilterRef?.current?.blur();
    //@ts-ignore
    userFilterInputRef?.current?.blur();
  };

  const onUserFilterInputChange = (value: string) => {
    if (getAllUser.data) {
      if (value.trim().length > 0) {
        setUserList(
          getAllUser.data.filter((user) =>
            user.name.toLowerCase().includes(value.trim().toLowerCase())
          )
        );
      } else {
        setUserList(getAllUser.data);
      }
      setUserFilterValue(value);
    }
  };

  const onWorkspaceChange = (workspaceIds: string[]) => {
    if (workspaceIds.length > 1 && workspaceIds.indexOf('All') !== -1) {
      workspaceIds.splice(workspaceIds.indexOf('All'), 1);
    }
    setSelectedWorkspaceIds(workspaceIds);
    setSkip(1);
    setWorkspaceFilterValue('');
    setWorkspacesList(getAllWorkspaces.data);
    //@ts-ignore
    workspaceFilterRef?.current?.blur();
    //@ts-ignore
    workspaceFilterInputRef?.current?.blur();
  };

  const onWorkspaceFilterInputChange = (value: string) => {
    if (getAllWorkspaces.data) {
      if (value.trim().length > 0) {
        setWorkspacesList(
          getAllWorkspaces.data.filter((workspace) =>
            workspace.name.toLowerCase().includes(value.trim().toLowerCase())
          )
        );
      } else {
        setWorkspacesList(getAllWorkspaces.data);
      }
      setWorkspaceFilterValue(value);
    }
  };

  const onEnvironmentChange = (environmentId: string) => {
    setSelectedEnvironmentId(environmentId);
    setSkip(1);
  };

  // const onUserPreferenceChange = (newValue: CheckboxValueType[]) => {
  //   // @ts-ignore
  //   setUserPreference(newValue);
  //   columnValue(newValue);
  // };

  const pagination = useMemo(
    () => ({
      total: getAuditLog.data?.totalRecord,
      pageSize: skipLimit,
      showSizeChanger: true,
      current: skip,
      hideOnSinglePage: !!(
        getAuditLog.data &&
        getAuditLog.data.totalRecord &&
        getAuditLog.data.totalRecord < PAGE_SIZE
      ),
      pageSizeOptions: [5, 10, 20, 50, 100],
      locale: { items_per_page: ' per page' },
      onChange: (page: number, pageSize: number) => {
        setSkip(page);
        setSkipLimit(pageSize);
        getAuditLog.reset();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [skip, skipLimit, getAuditLog.data]
  );

  // const columnValue = (val: CheckboxValueType[]) => {
  //   const arr = [];

  //   if (val.includes('module')) {
  //     arr.push({
  //       title: sortableHeader(
  //         t('common.labels.module'),
  //         'moduleName',
  //         columnSortOrder
  //       ),
  //       dataIndex: 'moduleName',
  //       key: 'moduleName',
  //       sorter: true,
  //       width: '15%',
  //     });
  //   }

  //   if (val.includes('environment')) {
  //     arr.push({
  //       title: t('common.labels.environment'),
  //       dataIndex: 'environmentIds',
  //       key: 'environmentIds',
  //       width: '15%',
  //     });
  //   }

  //   if (val.includes('user')) {
  //     arr.push({
  //       title: sortableHeader(
  //         t('common.labels.user'),
  //         'userId',
  //         columnSortOrder
  //       ),
  //       dataIndex: 'userId',
  //       sorter: true,
  //       key: 'userId',
  //       width: '15%',
  //     });
  //   }

  //   if (val.includes('dateTime')) {
  //     arr.push({
  //       title: sortableHeader(
  //         t('common.labels.date_and_time'),
  //         'createdAt',
  //         columnSortOrder
  //       ),
  //       sorter: true,
  //       dataIndex: 'createdAt',
  //       key: 'createdAt',
  //       width: '12%',
  //     });
  //   }

  //   setColumns([
  //     {
  //       title: sortableHeader(
  //         t('common.labels.logs'),
  //         'description',
  //         columnSortOrder
  //       ),
  //       dataIndex: 'description',
  //       key: 'description',
  //       width: 'auto',
  //       sorter: true,
  //       render: (text: string) => (
  //         <div
  //           className={`ant-row ant-row-middle ant-row-no-wrap ant-row-space-between table-text-button`}>
  //           <div className="table-text">
  //             <div className={'with-pixel'}>{text}</div>
  //           </div>
  //         </div>
  //       ),
  //     },
  //     ...arr,
  //   ]);
  // };

  // const userPreferenceContent = [
  //   {
  //     label: t('common.labels.module'),
  //     value: 'module',
  //   },
  //   {
  //     label: t('common.labels.environment'),
  //     value: 'environment',
  //   },
  //   {
  //     label: t('common.labels.user'),
  //     value: 'user',
  //   },
  //   {
  //     label: t('common.labels.date_and_time'),
  //     value: 'dateTime',
  //   },
  // ];

  return {
    t,
    columns,
    columnData: getAuditLog.data?.items,
    selectedUserIds,
    selectedWorkspaceIds,
    selectedEnvironmentId,
    totalRecordCount: getAuditLog.data?.totalRecord,
    skipLimit,
    loading: getAuditLog.isLoading,
    userList,
    workspacesList,
    environmentList: getAllEnvironments.data,
    workspaceFilterRef,
    workspaceFilterInputRef,
    workspaceFilterValue,
    userFilterRef,
    userFilterInputRef,
    userFilterValue,
    onUserChange,
    onWorkspaceChange,
    onEnvironmentChange,
    onWorkspaceFilterInputChange,
    onUserFilterInputChange,
    pagination,
    onInputChange,
    getAuditLogIsSuccess: getAuditLog.isSuccess,
  };
};

export default useListAuditLogsController;
