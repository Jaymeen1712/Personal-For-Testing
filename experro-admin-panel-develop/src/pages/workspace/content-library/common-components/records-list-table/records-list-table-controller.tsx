//@ts-nocheck
import React, { useContext, useEffect, useRef, useState } from 'react';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Button, Dropdown, Menu, Tag, Form, Tooltip } from 'antd';
import debounce from 'lodash.debounce';
import { useTranslation } from 'react-i18next';
import moment from 'moment/moment';

import {
  useGetRecordList,
  useDeleteRecord,
  useCreateTitle,
  useUserPreference,
  useUpdateUserPreference,
  useGetModelList,
} from '../../services';
import useUser from '../../../../../hooks/user';
import queryClient from '../../../../../query-client';
import { API_QUERY_KEY, openNotificationWithIcon } from '../../../../../utills';
import { ContentLibraryContext } from '../../context';
import useError from '../../../../../hooks/error';
import EllipsisIcon from '../../../../../images/icons/ellipsis-icon';
import usePermissionCheckForRecords from '../../utils/prermission-check-for-records';

interface DataType {
  id: string;
  title?: string;
  languages?: string;
  status?: { [k: string]: string }[];
  key?: string;
  currentVersionId?: string;
  modifiedBy: string;
  modifiedAt?: string;
}

const UseRecordsListTableController = (
  onEditRecordButtonClick: (val: boolean) => void,
  selectedContentModalInternalName: string,
  changeRecordEditDetails: (
    isEdit: boolean,
    id: string,
    currentVersionId: string
  ) => void
) => {
  const contentLibraryContext = useContext(ContentLibraryContext);
  const userDetails = useUser();
  const { recordPermissionCheck } = usePermissionCheckForRecords(
    selectedContentModalInternalName
  );

  const [form] = Form.useForm();
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const { workspaceId, contentModalId } = useParams<{
    workspaceId: string;
    contentModalId: string;
  }>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState('');
  const [searchData, setSearchData] = useState('');
  const [userPreference, setUserPreference] = useState(['']);
  const [userPreferenceId, setUserPreferenceId] = useState('');
  const [tempState, setTempState] = useState<CheckboxValueType[]>(['']);
  const [skip, setSkip] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [skipLimit, setSkipLimit] = useState(20);
  const [userIdList, setUserIdList] = useState([]);
  const [envId, setEnvId] = useState(
    localStorage.getItem(`${workspaceId}/environmentId`)
  );
  const [selectedUserLength, setSelectedUserLength] = useState(0);
  const [columnSortOrder, setColumnSortOrder] = useState({
    sortBy: '',
    orderBy: '',
  });
  // const [isSortByClick, setIsSortByClick] = useState(false);
  const [usersDetailsList, setUsersDetailsList] = useState<
    { id: string; name: string }[]
  >([]);
  const [userFilteredList, setUserFilteredList] = useState<
    { id: string; name: string }[]
  >([]);
  const [userInputFilterValue, setUserInputFilterValue] = useState('');
  const userInputFilterRef = useRef();

  const deleteRecord = useDeleteRecord(workspaceId, contentModalId);
  const createTitle = useCreateTitle(workspaceId);
  const getUserPreference = useUserPreference(
    workspaceId,
    contentModalId,
    userDetails?.user?.id
  );
  const updateUserPreference = useUpdateUserPreference(workspaceId);
  const collectionTypes = useGetModelList(
    workspaceId,
    localStorage.getItem(`${workspaceId}/environmentId`)
  );
  const getRecordList = useGetRecordList(
    workspaceId,
    skip,
    skipLimit,
    userIdList,
    contentModalId,
    searchData,
    envId,
    contentLibraryContext?.recordFilterData.status,
    columnSortOrder
  );

  useError({
    mutation: deleteRecord,
    entity: t('common.labels.languages'),
    cb: () => setIsModalOpen(false),
  });

  useError({
    mutation: createTitle,
    entity: t('common.labels.title'),
  });

  const [columnData, setColumnData] = useState<DataType[]>([
    {
      key: '',
      id: '',
      title: '',
      languages: '',
      modifiedBy: ``,
      modifiedAt: '',
      status: [{ '': '' }],
      currentVersionId: '',
    },
  ]);

  useEffect(() => {
    setColumnData([
      {
        key: '',
        id: '',
        title: '',
        languages: '',
        modifiedBy: ``,
        modifiedAt: '',
        status: [{ '': '' }],
        currentVersionId: '',
      },
    ]);
    setTotalRecordCount(0);
  }, [contentModalId, searchData]);

  // useEffect(() => {
  //   if (!isSortByClick && searchData) {
  //     setColumnData([]);
  //     setTotalRecordCount(0);
  //   }
  // }, [searchData, isSortByClick]);

  const onPreviewButtonClick = (val: string, pageSlug: string) => {
    const environmentDetails = contentLibraryContext?.environmentList.find(
      (item) => item.id === localStorage.getItem(`${workspaceId}/environmentId`)
    );
    if (environmentDetails?.customDomain) {
      window.open(
        `https://${environmentDetails.customDomain}${pageSlug}?vid=${val}&lang=en-us`,
        '_blank'
      );
    } else if (environmentDetails?.cacheDomain) {
      window.open(
        `https://${environmentDetails.cacheDomain}${pageSlug}?vid=${val}&lang=en-us`,
        '_blank'
      );
    } else {
      window.open(
        `http://${environmentDetails?.workspaceDomain}${pageSlug}?vid=${val}&lang=en-us`,
        '_blank'
      );
    }
  };

  const columnValue = (val: CheckboxValueType[]) => {
    const arr = [];

    if (val.includes('language')) {
      arr.push({
        title: t('common.labels.languages'),
        dataIndex: 'languages',
        key: 'languages',
        width: '8%',
      });
    }
    if (val.includes('created_at')) {
      arr.push({
        title: t('common.labels.created_at'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: '17%',
        // sorter: true,
      });
    }

    if (val.includes('created_by')) {
      arr.push({
        title: t('common.labels.created_by'),
        dataIndex: 'createdBy',
        key: 'createdBy',
        width: '12%',
        // sorter: true,
      });
    }

    if (val.includes('modified_by')) {
      arr.push({
        title: t('common.labels.modified_by'),
        dataIndex: 'modifiedBy',
        key: 'modifiedBy',
        width: '12%',
        // sorter: true,
      });
    }

    if (val.includes('modified_at')) {
      arr.push({
        title: t('common.labels.modified_at'),
        dataIndex: 'modifiedAt',
        key: 'modifiedAt',
        width: '17%',
        // sorter: true,
      });
    }

    if (val.includes('status')) {
      arr.push({
        title: t('common.labels.status'),
        dataIndex: 'status',
        key: 'status',
        width: '8%',

        render: (status: { [k: string]: string }[]) => (
          <>
            {status.includes('PUBLISHED') ? (
              <Tag color="success" key="recordSuccess">
                {t('common.labels.Published')}
              </Tag>
            ) : status.includes('SCHEDULE') ? (
              <Tag color="blue" key="recordBlue">
                {t('common.labels.Scheduled')}
              </Tag>
            ) : (
              status.includes('DRAFT') && (
                <Tag color="warning" key="recordWarning">
                  {t('common.labels.draft')}
                </Tag>
              )
            )}
          </>
        ),
      });
    }

    if (val.includes('id')) {
      arr.push({
        title: t('common.labels.id'),
        dataIndex: 'id',
        key: 'id',
        width: '14%',
      });
    }

    setColumns([
      {
        title: t('common.labels.title'),
        dataIndex: 'title',
        key: 'title',
        width: '12%',
        // sorter: true,
        render: (
          text: string,
          {
            id,
            currentVersionId,
            pageSlug,
            ...rest
          }: {
            id: string;
            currentVersionId: string;
            pageSlug: string;
          }
        ) => (
          <>
            <div
              className={`ant-row ant-row-middle ant-row-no-wrap ant-row-space-between table-text-button`}>
              <div className="table-text">
                <Tooltip
                  placement="right"
                  title={
                    !recordPermissionCheck('read') &&
                    t('common.messages.error_permission_read')
                  }>
                  <div
                    className={
                      recordPermissionCheck('read')
                        ? 'cursor-pointer text-blue text-truncate with-pixel'
                        : 'cursor-disable text-blue'
                    }
                    style={{ color: '#4F46E5' }}
                    onClick={() => {
                      if (recordPermissionCheck('read')) {
                        const url = location.pathname.split('/');
                        history.push(
                          `/workspaces/${url[2]}/content-library/collection-type/${url[5]}/field/${id}/version/${currentVersionId}/language/en-us`
                        );
                      }
                    }}>
                    {text}
                  </div>
                  <span className="gray-text text-truncate with-pixel display-block">
                    {pageSlug}
                  </span>
                </Tooltip>
              </div>
              <Dropdown
                placement="bottomRight"
                trigger={['click']}
                overlay={
                  <div className="table-dropdown">
                    <Menu>
                      <Menu.Item
                        key={id}
                        disabled={!recordPermissionCheck('update')}
                        onClick={() => {
                          changeRecordEditDetails(true, id, currentVersionId);
                          onEditRecordButtonClick(true);
                        }}>
                        <Tooltip
                          placement="left"
                          title={
                            !recordPermissionCheck('update') &&
                            t('common.messages.error_edit_record')
                          }>
                          {t('common.labels.edit')}
                        </Tooltip>
                      </Menu.Item>
                      {pageSlug && (
                        <Menu.Item
                          key={`${id}-preview`}
                          onClick={() => {
                            onPreviewButtonClick(
                              rest.previewVersionId,
                              pageSlug
                            );
                          }}>
                          {t('common.labels.preview')}
                        </Menu.Item>
                      )}

                      <Menu.Item
                        key={`${id}-delete`}
                        disabled={!recordPermissionCheck('delete')}
                        onClick={() => {
                          setDeleteRecordId(id);
                          setIsModalOpen(true);
                        }}>
                        <Tooltip
                          className="text-red"
                          placement="left"
                          title={
                            !recordPermissionCheck('delete') &&
                            t('common.messages.error_delete_record')
                          }>
                          {t('common.labels.delete')}
                        </Tooltip>
                      </Menu.Item>
                    </Menu>
                  </div>
                }>
                <Button
                  key="recordTableEllipsisIcon"
                  size="small"
                  type="text"
                  className="on-hover"
                  icon={<EllipsisIcon />}
                />
              </Dropdown>
            </div>
          </>
        ),
      },
      ...arr,
    ]);
  };

  const [columns, setColumns] = useState([]);

  const onChange = (newValue: CheckboxValueType[]) => {
    const value: {
      preferenceName: string;
      preferenceValue: CheckboxValueType[];
      preferenceId?: string;
    } = {
      preferenceName: 'record-list',
      preferenceValue: newValue,
    };

    if (userPreferenceId) {
      value['preferenceId'] = userPreferenceId;
    }
    updateUserPreference.mutate(value);
    setTempState(newValue);
  };

  useEffect(() => {
    columnValue(userPreference);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnSortOrder, userPreference]);

  const handleOk = () => {
    deleteRecord.mutate({
      contentModelDataIds: [`${deleteRecordId}`],
      environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onPageChange = (page: number, pageSize: number) => {
    setCurrentPageNumber(page);
    setSkip(page);
    setSkipLimit(pageSize);
    getRecordList.remove();
  };

  const onUserListChange = (val: string[]) => {
    setUserIdList(val);
    getRecordList.remove();
    setSelectedUserLength(val.length - 1);
    setUserInputFilterValue('');
    setUserFilteredList(usersDetailsList);
    //@ts-ignore
    userInputFilterRef?.current?.blur();
  };

  const onStatusChange = (val: string) => {
    contentLibraryContext?.changeRecordFilterData(
      localStorage.getItem(`${workspaceId}/environmentId`),
      val
    );
    getRecordList.remove();
  };

  const content = [
    {
      label: t('common.labels.languages'),
      value: 'language',
    },
    {
      label: t('common.labels.created_by'),
      value: 'created_by',
    },
    {
      label: t('common.labels.created_at'),
      value: 'created_at',
    },
    {
      label: t('common.labels.modified_by'),
      value: 'modified_by',
    },
    {
      label: t('common.labels.modified_at'),
      value: 'modified_at',
    },

    {
      label: t('common.labels.status'),
      value: 'status',
      disabled: true,
    },

    {
      label: t('common.labels.id'),
      value: 'id',
    },
    {
      label: t('common.labels.title'),
      value: 'title',
      disabled: true,
    },
  ];

  const onInputChange = debounce((val) => {
    setSearchData(val.target.value.trim());
    queryClient.removeQueries([
      API_QUERY_KEY.RECORD_TABLE_LIST,
      contentModalId,
      searchData,
    ]);
  }, 500);

  // const onChangeTable = (
  //   pagination: TablePaginationConfig,
  //   filters: Record<string, FilterValue | null>,
  //   sorter
  // ) => {
  //   if (!isSortByClick) {
  //     setIsSortByClick(true);
  //   }
  //   if (sorter.order === 'ascend') {
  //     setColumnSortOrder({
  //       sortBy: camelToSnackCase(sorter.field),
  //       orderBy: 'asc',
  //     });
  //   } else if (sorter.order === 'descend') {
  //     setColumnSortOrder({
  //       sortBy: camelToSnackCase(sorter.field),
  //       orderBy: 'desc',
  //     });
  //   } else {
  //     setColumnSortOrder({
  //       sortBy: '',
  //       orderBy: '',
  //     });
  //   }
  //   getRecordList.remove();
  // };

  useEffect(() => {
    const environmentChanges = (e) => {
      setEnvId(localStorage.getItem(`${workspaceId}/environmentId`));
      contentLibraryContext?.changeRecordFilterData(
        localStorage.getItem(`${workspaceId}/environmentId`),
        ''
      );
      getRecordList.remove();
      getUserPreference.remove();
    };
    document.addEventListener('environmentChange', environmentChanges);
    return () => {
      document.removeEventListener('environmentChange', environmentChanges);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPageNumber(1);
    if (skip > 1) {
      setSkip(1);
      getRecordList.remove();
    }

    if (skipLimit !== 20) {
      setSkipLimit(20);
      getRecordList.remove();
    }

    if (userIdList.length > 0) {
      setUserIdList([]);
      getRecordList.remove();
    }
    // setIsSortByClick(false);
    setColumnSortOrder({
      sortBy: '',
      orderBy: '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    setSearchData('');
    form.resetFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentLibraryContext?.titleAndSubtitle]);

  useEffect(() => {
    const array: DataType[] = [];
    if (getRecordList.isSuccess) {
      if (getRecordList.data.items) {
        getRecordList.data.items.map((item) => {
          let previewVersionId = '';
          const findPublishedVersion = Object.keys(item).find((item) =>
            item.endsWith('PublishedVersionId')
          );
          if (findPublishedVersion) {
            previewVersionId = item[findPublishedVersion];
          } else {
            previewVersionId = item.currentVersionId;
          }
          return array.push({
            key: item.id,
            id: item.id,
            title: item.title,
            languages: item.language,
            pageSlug: item.pageSlug,
            modifiedBy: `${
              userDetails?.listAllUser?.[
                `${item.modifiedBy ? item.modifiedBy : item.createdBy}`
              ]
                ? userDetails?.listAllUser?.[
                    `${item.modifiedBy ? item.modifiedBy : item.createdBy}`
                  ]
                : '-'
            }`,
            status: item.versionStatus,
            modifiedAt: moment(item.modifiedAt)
              .local()
              .format('DD MMM YYYY,LT'),
            currentVersionId: item.currentVersionId,
            createdBy: `${
              userDetails?.listAllUser?.[item.createdBy]
                ? userDetails?.listAllUser?.[item.createdBy]
                : '-'
            }`,
            createdAt: moment(item.createdAt).local().format('DD MMM YYYY,LT'),
            previewVersionId,
          });
        });
      }
      setTotalRecordCount(getRecordList.data.totalRecord);
      setColumnData([...array]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getRecordList.isSuccess, getRecordList.data]);

  useEffect(() => {
    if (getRecordList.isError) {
      setColumnData([]);
    }
  }, [getRecordList.isError]);

  useEffect(() => {
    if (deleteRecord.isSuccess) {
      queryClient.removeQueries([
        API_QUERY_KEY.RECORD_TABLE_LIST,
        contentModalId,
      ]);
      setIsModalOpen(false);
      openNotificationWithIcon(
        'success',
        t('common.messages.record_deleted_successfully')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteRecord.isSuccess]);

  useEffect(() => {
    if (createTitle.isSuccess) {
      const url = location.pathname.split('/');
      history.push(
        `/workspaces/${url[2]}/content-library/collection-type/${url[5]}/field/${createTitle.data.contentModelDataId}/version/${createTitle.data.versionId}/language/en-us`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createTitle.isSuccess]);

  useEffect(() => {
    if (getUserPreference.isSuccess) {
      if (getUserPreference.data.length > 0) {
        if (getUserPreference.data[0].preferenceValue.length > 0) {
          setUserPreference(getUserPreference.data[0].preferenceValue);
        }
        if (!getUserPreference.data[0].preferenceValue.includes('status')) {
          getUserPreference.data[0].preferenceValue.push('status');
        }
        if (!getUserPreference.data[0].preferenceValue.includes('title')) {
          getUserPreference.data[0].preferenceValue.push('title');
        }
        setUserPreferenceId(getUserPreference.data[0].id);
        columnValue(getUserPreference.data[0].preferenceValue);
      } else {
        setUserPreference(['modified_by', 'status', 'modified_at', 'title']);
        columnValue(['modified_by', 'status', 'modified_at', 'title']);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getUserPreference.isSuccess,
    getUserPreference.data,
    contentLibraryContext?.contentModalData,
  ]);

  useEffect(() => {
    if (getUserPreference.isError) {
      openNotificationWithIcon('error', 'Error in getting user Preference');
      setUserPreference(['modified_by', 'status', 'modified_at', 'title']);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserPreference.isError]);

  useEffect(() => {
    if (updateUserPreference.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.preference_update')
      );
      columnValue(tempState);
      getUserPreference.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUserPreference.isSuccess]);

  useEffect(() => {
    if (updateUserPreference.isError) {
      openNotificationWithIcon('error', 'Error in Update preference');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUserPreference.isError]);

  useEffect(() => {
    if (collectionTypes.isSuccess) {
      const title = collectionTypes.data?.find(
        (item) => item.id === contentModalId
      );
      contentLibraryContext?.changeSubSidebarActiveKey({
        type: 'collection',
        id: contentModalId,
      });
      if (title) {
        contentLibraryContext?.changeTitleAndSubtitle(
          title.name,
          title.description
        );

        contentLibraryContext?.changeOpenSubSidebarMenuItems([title.groupId]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionTypes.isSuccess]);

  useEffect(() => {
    if (collectionTypes.isError) {
      console.log(collectionTypes.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionTypes.isError]);

  useEffect(() => {
    if (userDetails && userDetails.listAllUser) {
      Object.keys(userDetails.listAllUser).map((item) =>
        usersDetailsList.push({ id: item, name: userDetails.listAllUser[item] })
      );
      setUsersDetailsList(usersDetailsList);
      setUserFilteredList(usersDetailsList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  const onUserFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (usersDetailsList) {
      setUserFilteredList(
        usersDetailsList.filter((item) =>
          item.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
      setUserInputFilterValue(e.target.value);
    }
  };

  return {
    userPreference,
    columns,
    columnData,
    content,
    onChange,
    isModalOpen,
    handleOk,
    handleCancel,
    t,
    deleteRecord,
    onInputChange,
    searchData,
    form,
    onPageChange,
    totalRecordCount,
    currentPageNumber,
    userFilteredList,
    onUserListChange,
    loading: getRecordList.isLoading,
    onStatusChange,
    skipLimit,
    selectedUserLength,
    // onChangeTable,
    // isSortByClick,
    userInputFilterValue,
    onUserFilterInputChange,
    userInputFilterRef,
  };
};

export default UseRecordsListTableController;
