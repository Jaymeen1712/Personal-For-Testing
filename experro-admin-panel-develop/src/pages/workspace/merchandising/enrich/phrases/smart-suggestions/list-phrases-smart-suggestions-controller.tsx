import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import {
  API_QUERY_KEY,
  openNotificationWithIcon,
  PAGE_SIZE,
} from '../../../../../../utills';
import { Button, Dropdown, Form, Menu, Tag, Tooltip } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { TableRowSelection } from 'antd/es/table/interface';
import moment from 'moment/moment';

import useUser from '../../../../../../hooks/user';
import { ISortDataObject, IWorkspaceParams } from '../../../../../../types';
import RightIcon from '../../../../../../images/icons/right-icon';
import EllipsisIcon from '../../../../../../images/icons/ellipsis-icon';
import queryClient from '../../../../../../query-client';
import CrossRedIcon from '../../../../../../images/icons/cross-icon';
import {
  useDeletePhrases,
  useGetSettingDetails,
  useGetUserPreference,
  useListPhrases,
  usePatchPhrasesStatus,
  useUpdatePhrases,
  useUpdateUserPreference,
} from '../../../services';
import useError from '../../../../../../hooks/error';
import usePermissions from '../../../../../../hooks/permissions';

const useListPhrasesSmartSuggestionsController = (
  environmentId: string,
  setIsEnableSmartSuggestions: (
    isEnablePhrasesSmartSuggestions: boolean
  ) => void
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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [columnSortOrder, setColumnSortOrder] = useState<ISortDataObject>({
    sortBy: 'modified_at',
    orderBy: 'desc',
  });
  const [searchData] = useState('');
  const [count] = useState();
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [skipLimit] = useState(20);
  const [status, setStatus] = useState('');
  // eslint-disable-next-line
  const [phraseId, setPhraseId] = useState<any>([]);
  const [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState(false);
  const [startConfidence, setStartConfidence] = useState<number>();
  const [endConfidence, setEndConfidence] = useState<number>();
  const [termName, setTermName] = useState<string | undefined>('');
  const [isStoreFound, setStoreFound] = useState<boolean>(true);
  const [isButtonVisible, setButtonVisible] = useState<boolean>(false);
  const [payLoadStatus, setPayLoadStatus] = useState('');
  const [isLoadLibraryModalVisible, setLoadLibraryModalVisible] =
    useState(false);

  const [
    isEditSmartSuggestionModalVisible,
    setIsEditSmartSuggestionModalVisible,
  ] = useState(false);
  // eslint-disable-next-line
  const [columnData, setColumnData] = useState<any>([]);

  const userDetails = useUser();
  const getUserPreference = useGetUserPreference(
    workspaceId,
    'smart-suggestions-phrases',
    userDetails?.user?.id
  );
  const getSettingDetails = useGetSettingDetails(workspaceId, 'PHRASES');
  const permission = usePermissions();

  const [isChange, setChange] = useState(false);
  const [disableSave, setIsDisableSave] = useState(true);

  const updateUserPreference = useUpdateUserPreference(workspaceId);
  const listSmartPhrases = useListPhrases(
    workspaceId,
    environmentId,
    page,
    pageSize,
    columnSortOrder.sortBy,
    columnSortOrder.orderBy,
    searchData,
    count,
    false,
    true,
    status,
    startConfidence,
    endConfidence
  );

  const deleteSmartPhrases = useDeletePhrases(workspaceId, environmentId);
  const publishPhrases = usePatchPhrasesStatus(workspaceId);

  const updateSmartPhrases = useUpdatePhrases(phraseId, workspaceId);

  useError({
    mutation: deleteSmartPhrases,
    entity: t('common.labels.phrases'),
  });

  useError({
    mutation: publishPhrases,
    entity: t('common.labels.phrases'),
  });

  useError({
    mutation: updateSmartPhrases,
    entity: t('common.labels.phrases'),
  });

  const onUserPreferenceChange = (newValue: CheckboxValueType[]) => {
    const value: {
      preferenceName: string;
      preferenceValue: CheckboxValueType[];
      preferenceId?: string;
    } = {
      preferenceName: 'smart-suggestions-phrases',
      preferenceValue: newValue,
    };

    if (userPreferenceId) {
      value['preferenceId'] = userPreferenceId;
    }
    updateUserPreference.mutate(value);
    setSelectedFields(newValue);
  };

  const onDeleteSmartSuggestion = () => {
    if (phraseId) {
      const payload = {
        phrasesIds: Array.isArray(phraseId) ? phraseId : [phraseId],
        status: 'REJECTED',
        environment_id: environmentId,
      };
      setPayLoadStatus(payload.status);
      publishPhrases.mutate(payload);
    }
  };
  // eslint-disable-next-line
  const onEditSmartSuggestionsClick = (item: any) => {
    setPhraseId([item.id]);
    form.setFieldsValue({
      phrase: item.canonicalForm,
    });
    setIsEditSmartSuggestionModalVisible(true);
  };

  const onPublishRecord = (id: string) => {
    const payload = {
      phrasesIds: [id],
      status: 'PUBLISHED',
      environment_id: environmentId,
    };
    setPayLoadStatus(payload.status);
    publishPhrases.mutate(payload);
  };
  // eslint-disable-next-line
  const onRejectRecord = (item: any) => {
    setPhraseId(item.id);
    setTermName(item.canonicalForm);
    setIsVisibleDeleteModal(true);
  };

  const handleFieldChange = () => {
    const values = form.getFieldsValue();
    if (values.phrase) {
      setIsDisableSave(false);
    } else {
      setIsDisableSave(true);
    }
  };

  useEffect(() => {
    columnValue(userPreference);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPreference]);

  const columnValue = (selectedCheckboxOfFields: CheckboxValueType[]) => {
    const arr = [];

    if (selectedCheckboxOfFields.includes('word_count')) {
      arr.push({
        title: t('common.labels.word_count'),
        dataIndex: 'wordCount',
        key: 'wordCount',
        width: 'auto',
        render: (word_count: number) => {
          return `${word_count ? word_count : '-'}`;
        },
      });
    }

    if (selectedCheckboxOfFields.includes('confidence')) {
      arr.push({
        title: t('common.labels.confidence'),
        dataIndex: 'confidence',
        key: 'confidence',
        width: 'auto',
        render: (confidence: number) => {
          return `${confidence ? confidence : '-'}`;
        },
      });
    }

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
        render: (date: string) => {
          return `${date ? moment(date).format('DD MMM, YYYY HH:mm A') : '-'}`;
        },
      });
    }

    if (selectedCheckboxOfFields.includes('modified_on')) {
      arr.push({
        title: t('common.labels.modified_on'),
        dataIndex: 'modifiedAt',
        key: 'modifiedAt',
        width: 'auto',
        render: (date: string) => {
          return `${date ? moment(date).format('DD MMM, YYYY HH:mm A') : '-'}`;
        },
      });
    }
    if (selectedCheckboxOfFields.includes('modified_by')) {
      arr.push({
        title: t('common.labels.search_modified_by'),
        dataIndex: 'modifiedBy',
        key: 'modifiedBy',
        width: 'auto',
        render: (text: string) => {
          return `${text ? userDetails?.listAllUser?.[text] : '-'}`;
        },
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
          } else if (status === 'APPROVED') {
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
        title: t('common.labels.phrase'),
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
                    onClick={() => onEditSmartSuggestionsClick(item)}
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
                            key={item.id}
                            onClick={() => onEditSmartSuggestionsClick(item)}>
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
      label: t('common.labels.phrase'),
      value: 'term',
      disabled: true,
    },
    {
      label: t('common.labels.count'),
      value: 'word_count',
      disabled: true,
    },
    {
      label: t('common.labels.confidence'),
      value: 'confidence',
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
    (synonymsObject: any) => {
      if (
        selectedRowKeys.findIndex(
          (selectedRecord) => selectedRecord === synonymsObject.key
        ) === -1
      ) {
        setSelectedRowKeys([...selectedRowKeys, synonymsObject.key]);
      } else {
        setSelectedRowKeys(
          selectedRowKeys.filter(
            (selectedRecord) => selectedRecord !== synonymsObject.key
          )
        );
      }
    },
    [selectedRowKeys]
  );

  const onSelectAll = () => {
    setSelectedRowKeys(
      // @ts-ignore
      listSmartPhrases.data?.items.map((redirection) => redirection.id)
    );
  };

  const onClearAllSelect = () => {
    setSelectedRowKeys([]);
  };

  const hideLoadLibraryModal = () => {
    setLoadLibraryModalVisible(false);
  };

  const onLoadLibraryClick = () => {
    setLoadLibraryModalVisible(true);
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
        listSmartPhrases.remove();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize, totalRecordCount]
  );

  const onChangeStatus = (status: string) => {
    setPage(1);
    setStatus(status);
  };

  const onSliderChange = (value: [number, number]) => {
    if (value) {
      setStartConfidence(value[0]);
      setEndConfidence(value[1]);
    }
  };

  useEffect(() => {
    if (startConfidence || endConfidence) {
      setChange(true);
    }
  }, [startConfidence, endConfidence]);

  useEffect(() => {
    if (isChange) {
      setTimeout(() => {
        listSmartPhrases?.refetch();
        setChange(false);
      }, 1000);
    }
    // eslint-disable-next-line
  }, [isChange]);

  const onResetConfidenceValue = () => {
    setStartConfidence(0);
    setEndConfidence(100);
  };

  // eslint-disable-next-line
  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: (e) => onSelectChange(e),
  };

  const onCancel = () => {
    setIsVisibleDeleteModal(false);
    setIsEditSmartSuggestionModalVisible(false);
    setSelectedRowKeys([]);
  };

  const onSelectDeleteClick = () => {
    setPhraseId(selectedRowKeys);
    setIsVisibleDeleteModal(true);
  };

  const onClickBackToList = () => {
    history.push(`/workspaces/${workspaceId}/discovery/enrich/phrases`);
  };

  const onSelectPublishClick = () => {
    const payload = {
      phrasesIds: selectedRowKeys,
      status: 'PUBLISHED',
      environment_id: environmentId,
    };
    setPayLoadStatus(payload.status);
    publishPhrases.mutate(payload);
  };

  const onSaveAndPublish = async () => {
    const values = await form.validateFields();
    const smartValues = {
      canonicalForm: values.phrase,
      surfaceForm: [values.phrase],
      displayForm: [values.phrase],
      wordCount: values.word_count,
      environmentId: environmentId,
      isApproved: true,
      status: 'PUBLISHED',
    };

    updateSmartPhrases.mutate(smartValues);
  };

  const statusOptions = useMemo(
    () => [
      { value: '', label: t('common.labels.all') },
      { value: 'PENDING', label: t('common.labels.pending') },
      { value: 'REJECTED', label: t('common.labels.rejected') },
    ],
    [t]
  );

  useEffect(() => {
    // eslint-disable-next-line
    // const array: any[] = [];
    if (listSmartPhrases.isSuccess) {
      if (listSmartPhrases.data) {
        // listSmartPhrases?.data?.items?.map((item) => {
        //   return array.push({
        //     key: item.id,
        //     term: item,
        //     wordCount: item.wordCount,
        //     confidence: item.confidence,
        //     frequency: item.frequency,
        //     suggesteAt: item.suggestedAt
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

        if (listSmartPhrases.data?.items) {
          setColumnData(
            listSmartPhrases.data.items.map((item) => ({
              ...item,
              key: item.id,
            }))
          );
        }

        if (listSmartPhrases?.data) {
          setTotalRecordCount(listSmartPhrases?.data?.totalRecord);
        }
        // setColumnData([...array]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listSmartPhrases.isSuccess, listSmartPhrases?.data]);

  useEffect(() => {
    if (listSmartPhrases.isError) {
      setColumnData([]);
    }
  }, [listSmartPhrases.isError]);

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
          setSelectedFields(['term', 'word_count', 'actions', 'status']);
          setUserPreference(['term', 'word_count', 'actions', 'status']);
          columnValue(['term', 'word_count', 'actions', 'status']);
        }
      } else {
        setUserPreference(['term', 'word_count', 'actions', 'status']);
        setSelectedFields(['term', 'word_count', 'actions', 'status']);
        columnValue(['term', 'word_count', 'actions', 'status']);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserPreference.isSuccess, selectedRowKeys.length]);

  useEffect(() => {
    if (updateUserPreference.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.preference_update')
      );
      columnValue(selectedFields);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUserPreference.isSuccess]);

  useEffect(() => {
    if (updateSmartPhrases.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.LIST_PHRASES]);
      setIsEditSmartSuggestionModalVisible(false);
      form.resetFields();
      openNotificationWithIcon(
        'success',
        t('common.messages.publish_successfully')
      );
    }
  }, [form, t, workspaceId, updateSmartPhrases.isSuccess]);

  useEffect(() => {
    if (deleteSmartPhrases.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.deleted_successfully')
      );
      queryClient.removeQueries([API_QUERY_KEY.LIST_PHRASES]);
      setPage(1);
      onCancel();
    }
  }, [deleteSmartPhrases.isSuccess, t, workspaceId]);

  useEffect(() => {
    if (getSettingDetails?.data) {
      setIsEnableSmartSuggestions(getSettingDetails?.data?.isSmartSuggestion);
    }
    // eslint-disable-next-line
  }, [getSettingDetails?.data, getSettingDetails?.isSuccess]);

  useEffect(() => {
    if (publishPhrases.isSuccess) {
      setPage(1);
      if (payLoadStatus === 'PUBLISHED') {
        setPage(1);
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
      queryClient.removeQueries([API_QUERY_KEY.LIST_PHRASES]);
      onCancel();
    }
    // eslint-disable-next-line
  }, [publishPhrases.isSuccess, t, workspaceId]);

  useEffect(() => {
    if (selectedRowKeys?.length === 1) {
      const name = listSmartPhrases?.data?.items?.find(
        (item) => item.id === selectedRowKeys.toString()
      )?.canonicalForm;
      setTermName(name);
    }
    // eslint-disable-next-line
  }, [selectedRowKeys.length]);

  useEffect(() => {
    if (
      listSmartPhrases.isSuccess &&
      listSmartPhrases.data &&
      listSmartPhrases.data?.items.length > 0
    ) {
      setStoreFound(false);
      setButtonVisible(true);
    } else {
      setStoreFound(false);
      setButtonVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listSmartPhrases.isSuccess, listSmartPhrases.data]);

  useEffect(() => {
    if (listSmartPhrases.isError) {
      if (
        // @ts-ignore
        listSmartPhrases?.error?.response?.Error?.errorCode === 'EX-00047'
      ) {
        // @ts-ignore
        openNotificationWithIcon('error', listSmartPhrases.error.message);
        setStoreFound(true);
      }
    }
    // eslint-disable-next-line
  }, [listSmartPhrases.isError]);

  const onAddStore = () => {
    history.push(`/workspaces/${workspaceId}/apps`);
    setStoreFound(false);
  };

  const onSettingClick = () => {
    history.push(
      `/workspaces/${workspaceId}/discovery/enrich/phrases/settings`
    );
  };

  useEffect(() => {
    setStatus('');
    setSelectedRowKeys([]);
    setColumnSortOrder({
      sortBy: 'modified_at',
      orderBy: 'desc',
    });
  }, [environmentId]);

  return {
    t,
    form,
    columns,
    onUserPreferenceChange,
    userPreference,
    rowSelection,
    columnData,
    skipLimit,
    totalRecordCount,
    isLoadLibraryModalVisible,
    isVisibleDeleteModal,
    onCancel,
    status,
    startConfidence,
    endConfidence,
    hideLoadLibraryModal,
    onSliderChange,
    onResetConfidenceValue,
    setStatus,
    searchData,
    selectedRowKeys,
    onSelectDeleteClick,
    onSelectPublishClick,
    onDeleteSmartSuggestion,
    isEditSmartSuggestionModalVisible,
    onSaveAndPublish,
    onClickBackToList,
    statusOptions,
    workspaceId,
    termName,
    isStoreFound,
    isButtonVisible,
    onLoadLibraryClick,
    onAddStore,
    pagination,
    onSelectChange,
    onSettingClick,
    disableSave,
    handleFieldChange,
    isAllSelected:
      selectedRowKeys.length === listSmartPhrases.data?.items.length,
    onClearAllSelect,
    onSelectAll,
    onChangeStatus,
    content,
    isLoading: listSmartPhrases.isLoading,
    isSuccess: listSmartPhrases.isSuccess,
    isSaveAndPublishLoading: updateSmartPhrases.isLoading,
    isPublishLoading: publishPhrases.isLoading && payLoadStatus === 'PUBLISHED',
    isDeleteLoading: publishPhrases.isLoading && payLoadStatus === 'REJECTED',
    listSmartPhrasesDataLength: listSmartPhrases?.data?.items?.length,
    addBigcommerceStorePermission:
      permission.canReadEcommerceStore() &&
      permission.canCreateEcommerceStore(),
  };
};

export default useListPhrasesSmartSuggestionsController;
