import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import useUser from '../../../../../../hooks/user';
import { useHistory, useParams } from 'react-router-dom';
import {
  IListPhrases,
  IListSpellCheck,
  ISortDataObject,
  IWorkspaceParams,
} from '../../../../../../types';
import {
  API_QUERY_KEY,
  openNotificationWithIcon,
  PAGE_SIZE,
} from '../../../../../../utills';
import { Button, Dropdown, Form, Menu, Tooltip } from 'antd';
import EllipsisIcon from '../../../../../../images/icons/ellipsis-icon';
import moment from 'moment/moment';
import debounce from 'lodash.debounce';
import queryClient from '../../../../../../query-client';
import {
  useDeleteSpellCheck,
  useGetSettingDetails,
  useGetUserPreference,
  useListSpellCheck,
  usePatchStatus,
  useUpdateUserPreference,
} from '../../../services';
import useError from '../../../../../../hooks/error';
import usePermissions from '../../../../../../hooks/permissions';
import SparkleIcon from '../../../../../../images/icons/sparkle-icon';

const useListSpellCheckController = (
  environment: string,
  setIsEnableSpellCheck: (isEnableSpellCheck: boolean) => void
) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const permission = usePermissions();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const [selectedSortValue, setSelectedSortValue] =
    useState('recently_created');
  const [columnSortOrder, setColumnSortOrder] = useState<ISortDataObject>({
    sortBy: 'modified_at',
    orderBy: 'desc',
  });
  // eslint-disable-next-line
  const [columns, setColumns] = useState<any>([]);
  const [userPreference, setUserPreference] = useState<string[]>([]);
  const [userPreferenceId, setUserPreferenceId] = useState('');
  const [selectedFields, setSelectedFields] = useState<CheckboxValueType[]>([
    '',
  ]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<
    React.Key[] | string[]
  >([]);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Unpublish');
  const [searchForm] = Form.useForm();
  const [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState(false);
  // eslint-disable-next-line
  const [spellCheckId, setSpellCheckId] = useState<any>([]);
  const [termName, setTermName] = useState<string | undefined>('');
  // eslint-disable-next-line
  const [columnData, setColumnData] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [storeIssueFound, setStoreIssueFound] = useState<boolean>(false);
  const [isButtonVisible, setButtonVisible] = useState<boolean>(false);

  const userDetails = useUser();
  const getUserPreference = useGetUserPreference(
    workspaceId,
    'spellcheck-list',
    userDetails?.user?.id
  );
  const getSettingDetails = useGetSettingDetails(workspaceId, 'SPELLCHECK');
  const updateUserPreference = useUpdateUserPreference(workspaceId);
  const listSpellCheck = useListSpellCheck(
    workspaceId,
    page,
    pageSize,
    columnSortOrder.sortBy,
    columnSortOrder.orderBy,
    environment,
    searchData
  );
  const deleteSpellCheck = useDeleteSpellCheck(workspaceId, environment);
  const patchSpellCheckStatus = usePatchStatus(workspaceId);

  useError({
    mutation: deleteSpellCheck,
    entity: t('common.labels.spell_check'),
  });

  useError({
    mutation: patchSpellCheckStatus,
    entity: t('common.labels.spell_check'),
  });

  const sortingOptions = useMemo(
    () => [
      {
        value: 'recently_created',
        label: t('common.labels.recently_update'),
      },
      { value: 'oldest_created', label: t('common.labels.oldest_update') },
    ],
    [t]
  );

  const onSortByChange = (sortValue: string) => {
    setSelectedSortValue(sortValue);
    if (sortValue === 'recently_created') {
      setColumnSortOrder({
        orderBy: 'desc',
        sortBy: 'modified_at',
      });
    } else if (sortValue === 'oldest_created') {
      setColumnSortOrder({
        orderBy: 'asc',
        sortBy: 'created_at',
      });
    } else if (sortValue === 'a_to_z') {
      setColumnSortOrder({
        orderBy: 'asc',
        sortBy: 'canonical_form',
      });
    } else if (sortValue === 'z_to_a') {
      setColumnSortOrder({
        orderBy: 'desc',
        sortBy: 'canonical_form',
      });
    }
  };

  const onUserPreferenceChange = (newValue: CheckboxValueType[]) => {
    const value: {
      preferenceName: string;
      preferenceValue: CheckboxValueType[];
      preferenceId?: string;
    } = {
      preferenceName: 'spellcheck-list',
      preferenceValue: newValue,
    };

    if (userPreferenceId) {
      value['preferenceId'] = userPreferenceId;
    }
    updateUserPreference.mutate(value);
    setSelectedFields(newValue);
  };

  const pagination = useMemo(
    () => ({
      total: totalRecordCount,
      pageSize: pageSize,
      showSizeChanger: true,
      current: page,
      hideOnSinglePage: !!(totalRecordCount < PAGE_SIZE),
      pageSizeOptions: [5, 10, 20, 50, 100],
      locale: { items_per_page: ' per page' },
      onChange: (page: number, pageSize: number) => {
        setSelectedRowKeys([]);
        setPageSize(pageSize);
        setPage(page);
        listSpellCheck.remove();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize, totalRecordCount]
  );

  // eslint-disable-next-line
  const onEditClickSpellCheck = (record: any) => {
    form.setFieldsValue({
      term: record.canonicalForm,
      suggested_correction: record.surfaceForm,
    });
    setIsModalVisible(true);
    setSpellCheckId(record.id);
  };

  const onDeleteClickSpellCheck = (item: IListSpellCheck) => {
    setTermName(item.canonicalForm);
    setSpellCheckId([item.id]);
    setIsVisibleDeleteModal(true);
  };

  const onAddSpellCheck = () => {
    setIsModalVisible(true);
  };

  const onCancel = () => {
    setIsVisibleDeleteModal(false);
    setSpellCheckId([]);
    setSelectedRowKeys([]);
  };

  const onSettingClick = () => {
    history.push(
      `/workspaces/${workspaceId}/discovery/dictionaries/spell-check/settings`
    );
  };

  const onSmartSuggestionsClick = () => {
    history.push(
      `/workspaces/${workspaceId}/discovery/dictionaries/spell-check/smart-suggestions`
    );
  };

  const onDeleteSpellCheck = () => {
    if (spellCheckId) {
      deleteSpellCheck.mutate(spellCheckId);
    }
  };

  const onSelectDeleteClick = () => {
    setIsVisibleDeleteModal(true);
    setSpellCheckId(selectedRowKeys);
  };

  const onSelectStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const onSelectSaveClick = () => {
    const payload = {
      spellCheckIds: selectedRowKeys,
      status: selectedStatus === 'Unpublish' ? 'UNPUBLISHED' : 'PUBLISHED',
    };
    patchSpellCheckStatus.mutate(payload);
    setSelectedRowKeys([]);
  };

  const onInputChange = debounce((searchValue) => {
    setSearchData(searchValue);
    setPage(1);
    setSelectedRowKeys([]);
  }, 500);

  useEffect(() => {
    columnValue(userPreference);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPreference]);

  const columnValue = (selectedCheckboxOfFields: CheckboxValueType[]) => {
    const arr = [];

    if (selectedCheckboxOfFields.includes('frequency')) {
      arr.push({
        title: t('common.labels.frequency'),
        dataIndex: 'frequency',
        key: 'frequency',
        width: 'auto',
        render: (frequency: number) => {
          return `${frequency ? frequency : '-'}`;
        },
      });
    }

    if (selectedCheckboxOfFields.includes('suggested_on')) {
      arr.push({
        title: t('common.labels.suggested_on'),
        dataIndex: 'suggestedAt',
        key: 'suggestedAt',
        width: 'auto',
        // eslint-disable-next-line
        render: (suggestedAt: string, item: any) => {
          if (item.isUserDefined) {
            return '-';
          } else {
            return moment(suggestedAt).format('DD MMM, YYYY HH:mm A');
          }
        },
      });
    }

    if (selectedCheckboxOfFields.includes('published_on')) {
      arr.push({
        title: t('common.labels.published_on'),
        dataIndex: 'publishedAt',
        key: 'publishedAt',
        width: 'auto',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (date: string, record: any) =>
          moment(record.createdAt).format('DD MMM, YYYY HH:mm A'),
      });
    }

    if (selectedCheckboxOfFields.includes('published_by')) {
      arr.push({
        title: t('common.labels.published_by'),
        dataIndex: 'publishedBy',
        key: 'publishedBy',
        width: 'auto',
        render: (text: string) => userDetails?.listAllUser?.[text],
      });
    }

    if (selectedCheckboxOfFields.includes('modified_on')) {
      arr.push({
        title: t('common.labels.modified_on'),
        dataIndex: 'modifiedAt',
        key: 'modifiedAt',
        width: 'auto',
        render: (date: string) => moment(date).format('DD MMM, YYYY HH:mm A'),
      });
    }
    if (selectedCheckboxOfFields.includes('modified_by')) {
      arr.push({
        title: t('common.labels.search_modified_by'),
        dataIndex: 'modifiedBy',
        key: 'modifiedBy',
        width: 'auto',
        render: (text: string) => userDetails?.listAllUser?.[text],
      });
    }

    setColumns([
      {
        title: t('common.labels.term'),
        dataIndex: 'canonicalForm',
        key: 'canonicalForm',
        width: '20%',
        // eslint-disable-next-line
        render: (data: string, item: any) => (
          <>
            {item && (
              <div
                className={`ant-row ant-row-middle ant-row-no-wrap table-text-button`}>
                <div
                  onClick={() => onEditClickSpellCheck(item)}
                  className="text-blue cursor-pointer text-truncate with-pixel-xs">
                  {item.canonicalForm}
                </div>
                {!selectedRowKeys.length && (
                  <Dropdown
                    placement="bottomRight"
                    trigger={['click']}
                    overlay={
                      <div className="table-dropdown">
                        <Menu>
                          <Menu.Item
                            onClick={() => onEditClickSpellCheck(item)}>
                            {t('common.labels.edit')}
                          </Menu.Item>
                          <Menu.Item
                            key={2}
                            className="text-red"
                            onClick={() => onDeleteClickSpellCheck(item)}>
                            <p className="text-red m-0">
                              {t('common.labels.delete')}
                            </p>
                          </Menu.Item>
                        </Menu>
                      </div>
                    }>
                    <Button
                      key="recordTableEllipsisIcon"
                      type="text"
                      size="small"
                      className="on-hover"
                      icon={<EllipsisIcon />}
                      style={{ float: 'right' }}
                    />
                  </Dropdown>
                )}
              </div>
            )}
          </>
        ),
      },

      {
        title: '',
        dataIndex: '',
        key: '',
        width: '16px',
        className: 'sparkle-icon-col',
        render: (data: string, item: IListPhrases) => {
          if (!item.isUserDefined) {
            return (
              <>
                <Tooltip
                  title={t('common.messages.auto_suggestion_tooltip_message')}>
                  <div className="sparkle-icon cursor-pointer">
                    <SparkleIcon />
                  </div>
                </Tooltip>
              </>
            );
          } else {
            return '';
          }
        },
      },
      {
        title: t('common.labels.suggested_correction'),
        dataIndex: 'surfaceForm',
        key: 'surfaceForm',
        width: 'auto',
      },
      ...arr,
    ]);
  };

  const content = [
    {
      label: t('common.labels.term'),
      value: 'term',
      disabled: true,
    },
    {
      label: t('common.labels.suggested_correction'),
      value: 'suggested_correction',
      disabled: true,
    },
    {
      label: t('common.labels.frequency'),
      value: 'frequency',
    },
    {
      label: t('common.labels.suggested_on'),
      value: 'suggested_on',
    },

    {
      label: t('common.labels.published_on'),
      value: 'published_on',
    },

    {
      label: t('common.labels.published_by'),
      value: 'published_by',
    },
    {
      label: t('common.labels.search_modified_by'),
      value: 'modified_by',
    },
    {
      label: t('common.labels.modified_on'),
      value: 'modified_on',
    },
  ];

  const onSelectChange = useCallback(
    // eslint-disable-next-line
    (spellCheckObject: any) => {
      if (
        selectedRowKeys.findIndex(
          (selectedRecord) => selectedRecord === spellCheckObject.key
        ) === -1
      ) {
        setSelectedRowKeys([...selectedRowKeys, spellCheckObject.key]);
      } else {
        setSelectedRowKeys(
          selectedRowKeys.filter(
            (selectedRecord) => selectedRecord !== spellCheckObject.key
          )
        );
      }
    },
    [selectedRowKeys]
  );

  const onSelectAll = () => {
    setSelectedRowKeys(
      // @ts-ignore
      listSpellCheck.data?.items.map((redirection) => redirection.id)
    );
  };

  const onClearAllSelect = () => {
    setSelectedRowKeys([]);
  };

  useEffect(() => {
    // eslint-disable-next-line
    const array: any[] = [];
    if (listSpellCheck.isSuccess) {
      // listSpellCheck?.data?.items.map((item) => {
      //   return array.push({
      //     key: item.id,
      //     term: item,
      //     suggested_correction: item.surfaceForm,
      //     frequency: item.frequency,
      //     suggested_on: item.suggestedAt
      //       ? moment(item.suggestedAt).format('DD MMM, YYYY HH:mm A')
      //       : '-',
      //     published_on: item.publishedAt
      //       ? moment(item.createdAt).format('DD MMM, YYYY HH:mm A')
      //       : '-',
      //     published_by: `${userDetails?.listAllUser?.[item.publishedBy]}`,
      //     modified_on: item.modifiedAt
      //       ? moment(item.modifiedAt).format('DD MMM, YYYY HH:mm A')
      //       : '-',
      //     modified_by: item.modifiedBy
      //       ? `${userDetails?.listAllUser?.[item.modifiedBy]}`
      //       : '-',
      //   });
      // });
      if (listSpellCheck.data?.items) {
        setColumnData(
          listSpellCheck.data.items.map((item) => ({ ...item, key: item.id }))
        );
        setTotalRecordCount(listSpellCheck?.data?.totalRecord);
      }

      // setColumnData([...array]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listSpellCheck.isSuccess, listSpellCheck.data]);

  useEffect(() => {
    if (listSpellCheck.isError) {
      setColumnData([]);
    }
  }, [listSpellCheck.isError]);

  useEffect(() => {
    if (getUserPreference.isSuccess) {
      if (getUserPreference.data.length > 0) {
        if (getUserPreference.data[0].preferenceValue.length > 0) {
          setUserPreference(getUserPreference.data[0].preferenceValue);
          setUserPreferenceId(getUserPreference.data[0].id);
          setSelectedFields(getUserPreference.data[0].preferenceValue);
          columnValue(getUserPreference.data[0].preferenceValue);
        } else {
          setUserPreferenceId(getUserPreference.data[0].id);
          setSelectedFields(['term', 'suggested_correction']);
          setUserPreference(['term', 'suggested_correction']);
          columnValue(['term', 'suggested_correction']);
        }
      } else {
        setUserPreference(['term', 'suggested_correction']);
        setSelectedFields(['term', 'suggested_correction']);
        columnValue(['term', 'suggested_correction']);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getUserPreference.isSuccess,
    getUserPreference.data,
    selectedRowKeys.length,
  ]);

  useEffect(() => {
    if (updateUserPreference.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.preference_update')
      );
      columnValue(selectedFields);
      getUserPreference.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUserPreference.isSuccess]);

  useEffect(() => {
    if (deleteSpellCheck.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.deleted_successfully')
      );
      queryClient.removeQueries([API_QUERY_KEY.LIST_SPELL_CHECK]);
      setPage(1);
      onCancel();
    }
  }, [deleteSpellCheck.isSuccess, t, workspaceId]);

  useEffect(() => {
    if (patchSpellCheckStatus.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      queryClient.removeQueries([API_QUERY_KEY.LIST_SPELL_CHECK]);
      onCancel();
    }
  }, [patchSpellCheckStatus.isSuccess, t, workspaceId]);

  useEffect(() => {
    if (
      (listSpellCheck.isSuccess &&
        listSpellCheck.data &&
        listSpellCheck.data?.items.length > 0) ||
      searchData
    ) {
      setButtonVisible(true);
      setStoreIssueFound(false);
    } else {
      setButtonVisible(false);
      setStoreIssueFound(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listSpellCheck.isSuccess, listSpellCheck.data]);

  useEffect(() => {
    if (listSpellCheck.isError) {
      // @ts-ignore
      if (listSpellCheck?.error?.response?.Error?.errorCode === 'EX-00047') {
        // @ts-ignore
        openNotificationWithIcon('error', listSpellCheck.error.message);
        setStoreIssueFound(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listSpellCheck.isError]);

  useEffect(() => {
    if (getSettingDetails?.isSuccess && getSettingDetails?.data) {
      setIsEnableSpellCheck(getSettingDetails?.data?.isEnabled);
    }
    // eslint-disable-next-line
  }, [getSettingDetails?.data, getSettingDetails?.isSuccess]);

  useEffect(() => {
    searchForm.resetFields();
    setSelectedRowKeys([]);
    setSearchData('');
    setSelectedSortValue('recently_created');
    setColumnSortOrder({
      sortBy: 'modified_at',
      orderBy: 'desc',
    });
    // eslint-disable-next-line
  }, [environment]);

  useEffect(() => {
    if (selectedRowKeys.length === 1) {
      const record = listSpellCheck?.data?.items?.find(
        (item) => item.id === selectedRowKeys.toString()
      );
      if (record) {
        setTermName(record.canonicalForm);
      }
    }
    // eslint-disable-next-line
  }, [selectedRowKeys.length]);

  const onAddStore = () => {
    history.push(`/workspaces/${workspaceId}/platforms`);
    setStoreIssueFound(false);
  };

  return {
    t,
    storeIssueFound,
    form,
    columns,
    selectedSortValue,
    sortingOptions,
    onUserPreferenceChange,
    userPreference,
    columnData,
    totalRecordCount,
    isModalVisible,
    setIsModalVisible,
    isVisibleDeleteModal,
    onCancel,
    spellCheckId,
    setSpellCheckId,
    selectedRowKeys,
    onDeleteSpellCheck,
    onSelectDeleteClick,
    onSelectSaveClick,
    onAddSpellCheck,
    onSortByChange,
    onInputChange,
    selectedStatus,
    searchData,
    termName,
    onSelectStatusChange,
    onSmartSuggestionsClick,
    onSettingClick,
    workspaceId,
    permission,
    pagination,
    onAddStore,
    isButtonVisible,
    onSelectChange,
    onSelectAll,
    onClearAllSelect,
    searchForm,
    content,
    isAllSelected: selectedRowKeys.length === listSpellCheck.data?.items.length,
    isLoading: listSpellCheck.isLoading || listSpellCheck.isFetching,
    isSuccess: listSpellCheck.isSuccess,
    lisSpellcheckDataLength: listSpellCheck?.data?.items?.length || 0,
    isDeleteLoading: deleteSpellCheck.isLoading,
  };
};

export default useListSpellCheckController;
