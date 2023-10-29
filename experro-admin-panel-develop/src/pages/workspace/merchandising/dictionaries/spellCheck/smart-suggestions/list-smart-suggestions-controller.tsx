import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import {
  API_QUERY_KEY,
  openNotificationWithIcon,
  PAGE_SIZE,
} from '../../../../../../utills';
import useUser from '../../../../../../hooks/user';
import { useHistory, useParams } from 'react-router-dom';
import { ISortDataObject, IWorkspaceParams } from '../../../../../../types';
import { Button, Dropdown, Form, Menu, Tag, Tooltip } from 'antd';
import RightIcon from '../../../../../../images/icons/right-icon';
import EllipsisIcon from '../../../../../../images/icons/ellipsis-icon';
import debounce from 'lodash.debounce';
import moment from 'moment/moment';
import queryClient from '../../../../../../query-client';
import CrossRedIcon from '../../../../../../images/icons/cross-icon';
import {
  useDeleteSpellCheck,
  useGetSettingDetails,
  useGetUserPreference,
  useListSpellCheck,
  usePatchStatus,
  useUpdateSpellCheck,
  useUpdateUserPreference,
} from '../../../services';
import useError from '../../../../../../hooks/error';
import usePermissions from '../../../../../../hooks/permissions';

const useListSmartSuggestionsController = (
  environment: string,
  setIsEnableSmartSuggestions: (isEnableSmartSuggestion: boolean) => void
) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();

  const { workspaceId } = useParams<IWorkspaceParams>();
  // eslint-disable-next-line
  const [columns, setColumns] = useState<any>([]);

  const [userPreference, setUserPreference] = useState<string[]>([]);
  const [userPreferenceId, setUserPreferenceId] = useState('');
  const [selectedFields, setSelectedFields] = useState<CheckboxValueType[]>([
    '',
  ]);
  const [selectedSortValue, setSelectedSortValue] =
    useState('recently_created');
  const [status, setStatus] = useState('');
  const [columnSortOrder, setColumnSortOrder] = useState<ISortDataObject>({
    sortBy: 'created_at',
    orderBy: 'desc',
  });
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [searchData, setSearchData] = useState('');
  // eslint-disable-next-line
  const [spellCheckId, setSpellCheckId] = useState<any>([]);
  const [termName, setTermName] = useState<string | undefined>('');

  const [selectedRowKeys, setSelectedRowKeys] = useState<
    React.Key[] | string[]
  >([]);
  const [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState(false);
  const [
    isEditSmartSuggestionModalVisible,
    setIsEditSmartSuggestionModalVisible,
  ] = useState(false);

  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [page, setPage] = useState(1);

  // eslint-disable-next-line
  const [columnData, setColumnData] = useState<any>([]);
  const [storeIssueFound, setStoreIssueFound] = useState<boolean>(false);
  const [disableSave, setIsDisableSave] = useState(true);

  const getSettingDetails = useGetSettingDetails(workspaceId, 'SPELLCHECK');
  const [payLoadStatus, setPayLoadStatus] = useState('');

  const userDetails = useUser();
  const getUserPreference = useGetUserPreference(
    workspaceId,
    'smart-suggestions-spellcheck',
    userDetails?.user?.id
  );

  const permission = usePermissions();

  const updateUserPreference = useUpdateUserPreference(workspaceId);
  // eslint-disable-next-line
  const listSmartSpellCheck = useListSpellCheck(
    workspaceId,
    page,
    pageSize,
    columnSortOrder.sortBy,
    columnSortOrder.orderBy,
    environment,
    searchData,
    false,
    true,
    status
  );

  const updateSmartSpellCheck = useUpdateSpellCheck(spellCheckId, workspaceId);
  const deleteSmartSpellCheck = useDeleteSpellCheck(workspaceId, environment);
  const publishSpellCheck = usePatchStatus(workspaceId);

  useError({
    mutation: updateSmartSpellCheck,
    entity: t('common.labels.spell_check'),
  });

  useError({
    mutation: deleteSmartSpellCheck,
    entity: t('common.labels.spell_check'),
  });

  useError({
    mutation: publishSpellCheck,
    entity: t('common.labels.spell_check'),
  });

  const onUserPreferenceChange = (newValue: CheckboxValueType[]) => {
    const value: {
      preferenceName: string;
      preferenceValue: CheckboxValueType[];
      preferenceId?: string;
    } = {
      preferenceName: 'smart-suggestions-spellcheck',
      preferenceValue: newValue,
    };

    if (userPreferenceId) {
      value['preferenceId'] = userPreferenceId;
    }
    updateUserPreference.mutate(value);
    setSelectedFields(newValue);
  };

  const sortingOptions = useMemo(
    () => [
      { value: 'recently_created', label: t('common.labels.recently_update') },
      { value: 'oldest_created', label: t('common.labels.oldest_update') },
      { value: 'a_to_z', label: t('common.labels.a_to_z') },
      { value: 'z_to_a', label: t('common.labels.z_to_a') },
    ],
    [t]
  );

  const onSortByChange = (sortValue: string) => {
    setSelectedSortValue(sortValue);
    if (sortValue === 'recently_created') {
      setColumnSortOrder({
        orderBy: 'desc',
        sortBy: 'created_at',
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

  const onDeleteSmartSuggestion = () => {
    if (spellCheckId) {
      const payload = {
        spellCheckIds: Array.isArray(spellCheckId)
          ? spellCheckId
          : [spellCheckId],
        status: 'REJECTED',
        environment_id: environment,
      };
      setPayLoadStatus(payload.status);
      publishSpellCheck.mutate(payload);
    }
  };

  // eslint-disable-next-line
  const onEditAndPublishClick = (item: any) => {
    setSpellCheckId(item.id);
    form.setFieldsValue({
      term: item.canonicalForm,
      suggested_correction: item.surfaceForm,
    });
    setIsEditSmartSuggestionModalVisible(true);
  };

  const onInputChange = debounce((searchValue) => {
    setSearchData(searchValue);
  }, 1000);

  const onPublishRecord = (id: string) => {
    const payload = {
      spellCheckIds: [id],
      status: 'PUBLISHED',
      environment_id: environment,
    };
    setPayLoadStatus(payload.status);
    publishSpellCheck.mutate(payload);
  };
  // eslint-disable-next-line
  const onRejectRecord = (item: any) => {
    setSpellCheckId(item.id);
    setTermName(item.canonicalForm);
    setIsVisibleDeleteModal(true);
  };

  useEffect(() => {
    columnValue(userPreference);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPreference]);

  const columnValue = (selectedCheckboxOfFields: CheckboxValueType[]) => {
    const arr = [];

    if (selectedCheckboxOfFields.includes('suggested_correction')) {
      arr.push({
        title: t('common.labels.suggested_correction'),
        dataIndex: 'surfaceForm',
        key: 'surfaceForm',
        width: 'auto',
      });
    }

    if (selectedCheckboxOfFields.includes('frequency')) {
      arr.push({
        title: t('common.labels.frequency'),
        dataIndex: 'frequency',
        key: 'frequency',
        width: 'auto',
      });
    }

    if (selectedCheckboxOfFields.includes('suggested_on')) {
      arr.push({
        title: t('common.labels.suggested_on'),
        dataIndex: 'suggestedAt',
        key: 'suggestedAt',
        width: 'auto',
        render: (date: string) => moment(date).format('DD MMM, YYYY HH:mm A'),
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

    if (selectedCheckboxOfFields.includes('status')) {
      arr.push({
        title: t('common.labels.status'),
        dataIndex: 'status',
        key: 'status',
        width: 'auto',
        render: (status: string) => {
          if (status === 'PENDING') {
            return <Tag color="warning">Pending</Tag>;
          } else if (status === 'PUBLISHED') {
            return <Tag color="success">Approved</Tag>;
          } else {
            return <Tag color="error">Rejected</Tag>;
          }
        },
      });
    }

    arr.push({
      title: t('common.labels.actions'),
      dataIndex: 'actions',
      key: 'actions',
      width: '8%',
      // eslint-disable-next-line
      render: (status: string, item: any) => {
        return (
          <div className="ant-row ant-row-no-wrap">
            <Tooltip placement="top" title={t('common.labels.publish')}>
              <Button
                type="link"
                size="small"
                onClick={() => onPublishRecord(item.id)}
                icon={<RightIcon />}
              />
            </Tooltip>
            <Tooltip placement="top" title={t('common.labels.delete')}>
              <Button
                type="link"
                size="small"
                disabled={item.status === 'REJECTED'}
                onClick={() => onRejectRecord(item)}
                icon={<CrossRedIcon />}
              />
            </Tooltip>
          </div>
        );
      },
    });

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
                className={`ant-row ant-row-middle ant-row-no-wrap ant-row-space-between table-text-button`}>
                <div className="table-text">
                  <div
                    onClick={() => onEditAndPublishClick(item)}
                    className="text-blue cursor-pointer text-truncate with-pixel-xs">
                    {item.canonicalForm}
                  </div>
                </div>
                {!selectedRowKeys.length && (
                  <Dropdown
                    placement="bottomRight"
                    trigger={['click']}
                    overlay={
                      <div className="table-dropdown">
                        <Menu>
                          <Menu.Item
                            key={1}
                            onClick={() => onEditAndPublishClick(item)}>
                            {t('common.labels.edit')}
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
      label: t('common.labels.search_modified_by'),
      value: 'modified_by',
    },
    {
      label: t('common.labels.modified_on'),
      value: 'modified_on',
    },
    {
      label: t('common.labels.status'),
      value: 'status',
      disabled: true,
    },
    {
      label: t('common.labels.actions'),
      value: 'actions',
      disabled: true,
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
      listSmartSpellCheck?.data?.items.map((redirection) => redirection.id)
    );
  };

  const onClearAllSelect = () => {
    setSelectedRowKeys([]);
  };

  const onClickBackToList = () => {
    history.push(
      `/workspaces/${workspaceId}/discovery/dictionaries/spell-check`
    );
  };

  const pagination = useMemo(
    () => ({
      total: listSmartSpellCheck.data?.totalRecord,
      pageSize: pageSize,
      showSizeChanger: true,
      current: page,
      hideOnSinglePage:
        !!(
          listSmartSpellCheck.data &&
          listSmartSpellCheck.data.totalRecord &&
          listSmartSpellCheck.data.totalRecord < PAGE_SIZE
        ) || !!searchData,
      pageSizeOptions: [5, 10, 20, 50, 100],
      locale: { items_per_page: ' per page' },
      onChange: (page: number, pageSize: number) => {
        setSelectedRowKeys([]);
        setPageSize(pageSize);
        setPage(page);
        listSmartSpellCheck.remove();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listSmartSpellCheck.data, page, pageSize]
  );

  const onCancel = () => {
    setIsVisibleDeleteModal(false);
    setIsEditSmartSuggestionModalVisible(false);
    setSelectedRowKeys([]);
  };

  const onSelectDeleteClick = () => {
    setIsVisibleDeleteModal(true);
    setSpellCheckId(selectedRowKeys);
  };

  const onSelectPublishClick = () => {
    const payload = {
      spellCheckIds: selectedRowKeys,
      status: 'PUBLISHED',
      environment_id: environment,
    };
    setPayLoadStatus(payload.status);
    publishSpellCheck.mutate(payload);
  };

  const handleFieldChange = () => {
    const values = form.getFieldsValue();
    if (values.term && values.suggested_correction) {
      setIsDisableSave(false);
    } else {
      setIsDisableSave(true);
    }
  };

  const onSaveAndPublish = async () => {
    const values = await form.validateFields();
    const smartValues = {
      canonicalForm: values.term,
      surfaceForm: Array.isArray(values.suggested_correction)
        ? values.suggested_correction
        : [values.suggested_correction],
      displayForm: Array.isArray(values.suggested_correction)
        ? values.suggested_correction
        : [values.suggested_correction],
      isApproved: true,
      environmentId: environment,
      status: 'PUBLISHED',
    };

    updateSmartSpellCheck.mutate(smartValues);
  };

  useEffect(() => {
    // eslint-disable-next-line
    // const array: any[] = [];
    if (listSmartSpellCheck.isSuccess) {
      if (listSmartSpellCheck.data) {
        // listSmartSpellCheck?.data?.items?.map((item) => {
        //   return array.push({
        //     key: item.id,
        //     term: item,
        //     canonicalForm: item.canonicalForm,
        //     surfaceForm: item.surfaceForm,
        //     frequency: item.frequency,
        //     suggestedAt: item.suggestedAt
        //       ? moment(item.suggestedAt).format('DD MMM, YYYY HH:mm A')
        //       : '-',
        //     modifiedBy: item.modifiedBy
        //       ? `${userDetails?.listAllUser?.[item.modifiedBy]}`
        //       : '-',
        //     modifiedAt: item.modifiedAt
        //       ? moment(item.modifiedAt).format('DD MMM, YYYY HH:mm A')
        //       : '-',
        //     status: item.status,
        //     actions: item,
        //   });
        // });

        if (listSmartSpellCheck.data?.items) {
          setColumnData(
            listSmartSpellCheck.data.items.map((item) => ({
              ...item,
              key: item.id,
            }))
          );
        }
        if (listSmartSpellCheck?.data) {
          setTotalRecordCount(listSmartSpellCheck?.data?.totalRecord);
        }
        // setColumnData([...array]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listSmartSpellCheck.isSuccess, listSmartSpellCheck.data]);

  useEffect(() => {
    if (listSmartSpellCheck.isError) {
      setColumnData([]);
    }
  }, [listSmartSpellCheck.isError]);

  useEffect(() => {
    if (selectedRowKeys?.length === 1) {
      const name = listSmartSpellCheck?.data?.items.find(
        (item) => item.id === selectedRowKeys.toString()
      )?.canonicalForm;
      setTermName(name);
    }
    // eslint-disable-next-line
  }, [selectedRowKeys?.length]);

  useEffect(() => {
    if (getUserPreference.isSuccess) {
      if (getUserPreference.data.length > 0) {
        if (getUserPreference.data[0].preferenceValue.length > 0) {
          setUserPreference(getUserPreference.data[0].preferenceValue);
        }
        setUserPreferenceId(getUserPreference.data[0].id);
        columnValue(getUserPreference.data[0].preferenceValue);
      } else {
        setUserPreference([
          'term',
          'status',
          'suggested_correction',
          'actions',
        ]);
        columnValue(['term', 'status', 'suggested_correction', 'actions']);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getUserPreference.isSuccess,
    getUserPreference.data,
    selectedRowKeys.length,
  ]);

  useEffect(() => {
    if (getSettingDetails?.data) {
      setIsEnableSmartSuggestions(getSettingDetails?.data?.isSmartSuggestion);
    }
    // eslint-disable-next-line
  }, [getSettingDetails?.data, getSettingDetails?.isSuccess]);

  useEffect(() => {
    setStatus('');
    setSelectedRowKeys([]);
    setColumnSortOrder({
      sortBy: 'modified_at',
      orderBy: 'desc',
    });
  }, [environment]);

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
    if (
      (listSmartSpellCheck.isSuccess &&
        listSmartSpellCheck.data &&
        listSmartSpellCheck.data?.items.length > 0) ||
      searchData
    ) {
      setStoreIssueFound(false);
    } else {
      setStoreIssueFound(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listSmartSpellCheck.isSuccess, listSmartSpellCheck.data]);

  useEffect(() => {
    if (listSmartSpellCheck.isError) {
      if (
        // @ts-ignore
        listSmartSpellCheck?.error?.response?.Error?.errorCode === 'EX-00047'
      ) {
        // @ts-ignore
        openNotificationWithIcon('error', listSmartSpellCheck.error.message);
        setStoreIssueFound(true);
      }
    }
    // eslint-disable-next-line
  }, [listSmartSpellCheck.isError]);

  useEffect(() => {
    if (updateSmartSpellCheck.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.LIST_SPELL_CHECK]);
      setIsEditSmartSuggestionModalVisible(false);
      form.resetFields();
      setSpellCheckId([]);
      openNotificationWithIcon(
        'success',
        t('common.messages.publish_successfully')
      );
    }
    // eslint-disable-next-line
  }, [workspaceId, updateSmartSpellCheck.isSuccess]);

  useEffect(() => {
    if (deleteSmartSpellCheck.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.deleted_successfully')
      );
      queryClient.removeQueries([API_QUERY_KEY.LIST_SPELL_CHECK]);
      setPage(1);
      onCancel();
    }
    // eslint-disable-next-line
  }, [deleteSmartSpellCheck.isSuccess, workspaceId]);

  useEffect(() => {
    if (publishSpellCheck.isSuccess) {
      setPage(1);
      if (payLoadStatus === 'PUBLISHED') {
        openNotificationWithIcon(
          'success',
          t('common.messages.publish_successfully')
        );
      } else {
        openNotificationWithIcon(
          'success',
          t('common.messages.deleted_successfully')
        );
      }
      queryClient.removeQueries([API_QUERY_KEY.LIST_SPELL_CHECK]);
      onCancel();
    }
    // eslint-disable-next-line
  }, [publishSpellCheck.isSuccess, t, workspaceId]);

  const onAddStore = () => {
    history.push(`/workspaces/${workspaceId}/apps`);
    setStoreIssueFound(false);
  };

  const onSettingClick = () => {
    history.push(
      `/workspaces/${workspaceId}/discovery/dictionaries/spell-check/settings`
    );
  };

  return {
    t,
    form,
    columns,
    onUserPreferenceChange,
    userPreference,
    columnData,
    totalRecordCount,
    isVisibleDeleteModal,
    onCancel,
    selectedRowKeys,
    onSelectDeleteClick,
    onSelectPublishClick,
    onDeleteSmartSuggestion,
    isEditSmartSuggestionModalVisible,
    onSaveAndPublish,
    setStatus,
    onInputChange,
    sortingOptions,
    selectedSortValue,
    onSortByChange,
    searchData,
    onClickBackToList,
    status,
    workspaceId,
    termName,
    pagination,
    storeIssueFound,
    onAddStore,
    handleFieldChange,
    disableSave,
    onSelectAll,
    onClearAllSelect,
    onSelectChange,
    onSettingClick,
    content,
    isAllSelected:
      selectedRowKeys.length === listSmartSpellCheck?.data?.items.length,
    listSmartSpellcheckDataLength:
      listSmartSpellCheck?.data && listSmartSpellCheck?.data?.items?.length,
    isLoading: listSmartSpellCheck.isLoading,
    isSuccess: listSmartSpellCheck.isSuccess,
    isPublishLoading:
      publishSpellCheck.isLoading && payLoadStatus === 'PUBLISHED',
    isDeleteLoading:
      publishSpellCheck.isLoading && payLoadStatus === 'REJECTED',
    addBigcommerceStorePermission:
      permission.canReadEcommerceStore() &&
      permission.canCreateEcommerceStore(),
  };
};

export default useListSmartSuggestionsController;
