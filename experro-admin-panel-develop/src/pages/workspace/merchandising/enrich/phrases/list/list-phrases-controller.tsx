import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Dropdown, Form, Menu, Tooltip } from 'antd';
import moment from 'moment/moment';
import debounce from 'lodash.debounce';

import useUser from '../../../../../../hooks/user';
import { IListPhrases, ISortDataObject } from '../../../../../../types';
import {
  API_QUERY_KEY,
  openNotificationWithIcon,
  PAGE_SIZE,
} from '../../../../../../utills';
import EllipsisIcon from '../../../../../../images/icons/ellipsis-icon';
import queryClient from '../../../../../../query-client';
import {
  useDeletePhrases,
  useGetSettingDetails,
  useGetUserPreference,
  useListPhrases,
  usePatchPhrasesStatus,
  useUpdateUserPreference,
} from '../../../services';
import useError from '../../../../../../hooks/error';
import usePermissions from '../../../../../../hooks/permissions';
import SparkleIcon from '../../../../../../images/icons/sparkle-icon';

const useListPhrasesController = (
  environmentId: string,
  setIsEnablePhrases: (isEnablePhrases: boolean) => void
) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const permission = usePermissions();
  const history = useHistory();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSortValue, setSelectedSortValue] =
    useState('recently_created');
  const [columnSortOrder, setColumnSortOrder] = useState<ISortDataObject>({
    sortBy: 'modified_at',
    orderBy: 'desc',
  });
  const [status, setStatus] = useState();
  const [count, setCount] = useState();
  const [searchForm] = Form.useForm();
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
  const [isStoreFound, setStoreFound] = useState<boolean>(true);
  const [isButtonVisible, setButtonVisible] = useState<boolean>(false);
  const [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState(false);
  // eslint-disable-next-line
  const [phraseId, setPhraseId] = useState<any>([]);
  const [termName, setTermName] = useState<string | undefined>('');
  // eslint-disable-next-line
  const [columnData, setColumnData] = useState<any>([]);
  const userDetails = useUser();
  const getUserPreference = useGetUserPreference(
    workspaceId,
    'phrases-list',
    userDetails?.user?.id
  );
  const getSettingDetails = useGetSettingDetails(workspaceId, 'PHRASES');
  const updateUserPreference = useUpdateUserPreference(workspaceId);
  const listPhrases = useListPhrases(
    workspaceId,
    environmentId,
    page,
    pageSize,
    columnSortOrder.sortBy,
    columnSortOrder.orderBy,
    searchData,
    count
  );
  const deletePhrases = useDeletePhrases(workspaceId, environmentId);
  const patchPhraseUpdateStatus = usePatchPhrasesStatus(workspaceId);

  useError({
    mutation: deletePhrases,
    entity: t('common.labels.phrases'),
  });

  useError({
    mutation: patchPhraseUpdateStatus,
    entity: t('common.labels.phrases'),
  });

  const sortingOptions = useMemo(
    () => [
      { value: 'recently_created', label: t('common.labels.recently_update') },
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
      preferenceName: 'phrases-list',
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
        listPhrases.remove();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize, totalRecordCount]
  );

  const typeOption = useMemo(
    () => [
      { key: 'one', label: t('common.labels.one_way') },
      { key: 'two', label: t('common.labels.two_way') },
    ],
    [t]
  );

  const statusOption = useMemo(
    () => [
      { key: 'rejected', label: t('common.labels.rejected') },
      { key: 'pending', label: t('common.labels.pending') },
    ],
    [t]
  );

  const userStatusOptions = useMemo(
    () => [{ key: 'any', label: t('common.labels.any') }, ...statusOption],
    [t, statusOption]
  );

  // eslint-disable-next-line
  const onEditClickPhrases = (record: any) => {
    form.setFieldsValue({
      phrase: record.canonicalForm,
      word_count: record.wordCount,
    });
    setIsModalVisible(true);
    setPhraseId(record.id);
  };

  const onDeleteClickPhrases = (item: IListPhrases) => {
    setTermName(item.canonicalForm);
    setPhraseId([item.id]);
    setIsVisibleDeleteModal(true);
  };

  const onAddPhrases = () => {
    setIsModalVisible(true);
  };

  const onCancel = () => {
    setIsVisibleDeleteModal(false);
    setPhraseId([]);
    setSelectedRowKeys([]);
  };

  const onDeletePhrase = () => {
    if (phraseId) {
      deletePhrases.mutate(phraseId);
    }
  };

  const onSelectDeleteClick = () => {
    setIsVisibleDeleteModal(true);
    setPhraseId(selectedRowKeys);
  };

  const onSelectStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const onSettingClick = () => {
    history.push(
      `/workspaces/${workspaceId}/discovery/enrich/phrases/settings`
    );
  };

  const onSmartSuggestionsClick = () => {
    history.push(
      `/workspaces/${workspaceId}/discovery/enrich/phrases/smart-suggestions`
    );
  };

  const onSelectSaveClick = () => {
    const payload = {
      phrasesIds: selectedRowKeys,
      status: selectedStatus === 'Unpublish' ? 'UNPUBLISHED' : 'PUBLISHED',
    };
    patchPhraseUpdateStatus.mutate(payload);
    setSelectedRowKeys([]);
  };

  const onInputChange = debounce((searchValue) => {
    setSearchData(searchValue);
    setPage(1);
    setSelectedRowKeys([]);
  }, 1000);

  useEffect(() => {
    columnValue(userPreference);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPreference]);

  const columnValue = (selectedCheckboxOfFields: CheckboxValueType[]) => {
    const arr = [];

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
        render: (suggestedAt: string, item: IListPhrases) => {
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
        render: (date: string) => moment(date).format('DD MMM, YYYY HH:mm A'),
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
        render: (data: string, item: IListPhrases) => (
          <>
            {item && (
              <div
                className={`ant-row ant-row-middle ant-row-no-wrap table-text-button`}>
                <div
                  onClick={() => onEditClickPhrases(item)}
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
                          <Menu.Item onClick={() => onEditClickPhrases(item)}>
                            {t('common.labels.edit')}
                          </Menu.Item>
                          <Menu.Item
                            key={2}
                            className="text-red"
                            onClick={() => onDeleteClickPhrases(item)}>
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
        title: t('common.labels.word_count'),
        dataIndex: 'wordCount',
        key: 'wordCount',
        width: 'auto',
        // className:'text-right'
      },
      ...arr,
    ]);
  };

  const content = [
    {
      label: t('common.labels.phrase'),
      value: 'phrase',
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
    (phrasesObject: any) => {
      if (
        selectedRowKeys.findIndex(
          (selectedRecord) => selectedRecord === phrasesObject.key
        ) === -1
      ) {
        setSelectedRowKeys([...selectedRowKeys, phrasesObject.key]);
      } else {
        setSelectedRowKeys(
          selectedRowKeys.filter(
            (selectedRecord) => selectedRecord !== phrasesObject.key
          )
        );
      }
    },
    [selectedRowKeys]
  );

  const onSelectAll = () => {
    setSelectedRowKeys(
      // @ts-ignore
      listPhrases.data?.items.map((redirection) => redirection.id)
    );
  };

  const onClearAllSelect = () => {
    setSelectedRowKeys([]);
  };

  useEffect(() => {
    // eslint-disable-next-line
    // const array: any[] = [];
    if (listPhrases.isSuccess) {
      // listPhrases?.data?.items?.map((item) => {
      //   return array.push({
      //     key: item.id,
      //     phrase: item,
      //     word_count: item.wordCount,
      //     confidence: item.confidence,
      //     frequency: item.frequency,
      //     suggested_on: item.suggestedAt
      //       ? moment(item.suggestedAt).format('DD MMM, YYYY HH:mm A')
      //       : '-',
      //     published_on: item.createdAt
      //       ? moment(item.createdAt).format('DD MMM, YYYY HH:mm A')
      //       : '-',
      //     published_by: `${userDetails?.listAllUser?.[item.createdBy]}`,
      //     modified_on: item.modifiedAt
      //       ? moment(item.modifiedAt).format('DD MMM, YYYY HH:mm A')
      //       : '-',
      //     modified_by: item.modifiedBy
      //       ? `${userDetails?.listAllUser?.[item.modifiedBy]}`
      //       : '-',
      //   });
      // });
      if (listPhrases.data?.items) {
        setColumnData(
          listPhrases.data.items.map((item) => ({ ...item, key: item.id }))
        );
        setTotalRecordCount(listPhrases?.data?.totalRecord);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listPhrases.isSuccess, listPhrases.data]);

  useEffect(() => {
    if (listPhrases.isError) {
      setColumnData([]);
    }
  }, [listPhrases.isError]);

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
          setSelectedFields(['phrase', 'word_count']);
          setUserPreference(['phrase', 'word_count']);
          columnValue(['phrase', 'word_count']);
        }
      } else {
        setUserPreference(['phrase', 'word_count']);
        setSelectedFields(['phrase', 'word_count']);
        columnValue(['phrase', 'word_count']);
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
    if (deletePhrases.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.deleted_successfully')
      );
      queryClient.removeQueries([API_QUERY_KEY.LIST_PHRASES]);
      setPage(1);
      onCancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletePhrases.isSuccess, t, workspaceId]);

  useEffect(() => {
    if (patchPhraseUpdateStatus.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      queryClient.removeQueries([API_QUERY_KEY.LIST_PHRASES]);
      onCancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patchPhraseUpdateStatus.isSuccess, t, workspaceId]);

  useEffect(() => {
    if (
      (listPhrases.isSuccess &&
        listPhrases.data &&
        listPhrases.data?.items.length > 0) ||
      searchData
    ) {
      setButtonVisible(true);
      setStoreFound(true);
    } else {
      setButtonVisible(false);
      setStoreFound(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listPhrases.isSuccess, listPhrases.data]);

  useEffect(() => {
    if (listPhrases.isError) {
      // @ts-ignore
      if (listPhrases?.error.response.Error.errorCode === 'EX-00047') {
        // @ts-ignore
        openNotificationWithIcon('error', listPhrases.error.message);
        setStoreFound(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listPhrases.isError]);

  useEffect(() => {
    if (getSettingDetails?.isSuccess && getSettingDetails?.data) {
      setIsEnablePhrases(getSettingDetails?.data?.isEnabled);
    }
    // eslint-disable-next-line
  }, [getSettingDetails?.data, getSettingDetails?.isSuccess]);

  useEffect(() => {
    searchForm.resetFields();
    setSearchData('');
    setSelectedRowKeys([]);
    setSelectedSortValue('recently_created');
    setColumnSortOrder({
      sortBy: 'modified_at',
      orderBy: 'desc',
    });
    // eslint-disable-next-line
  }, [environmentId]);

  useEffect(() => {
    if (selectedRowKeys.length === 1) {
      const record = listPhrases?.data?.items?.find(
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
    setStoreFound(true);
  };

  return {
    t,
    isStoreFound,
    isButtonVisible,
    form,
    columns,
    selectedSortValue,
    sortingOptions,
    userStatusOptions,
    onUserPreferenceChange,
    userPreference,
    columnData,
    pagination,
    totalRecordCount,
    isVisibleDeleteModal,
    onCancel,
    phraseId,
    setPhraseId,
    selectedRowKeys,
    onDeletePhrase,
    onSelectDeleteClick,
    onSelectSaveClick,
    onSortByChange,
    onInputChange,
    selectedStatus,
    status,
    setStatus,
    typeOption,
    count,
    setCount,
    termName,
    searchData,
    onSelectStatusChange,
    onAddPhrases,
    isModalVisible,
    setIsModalVisible,
    onSettingClick,
    workspaceId,
    permission,
    onAddStore,
    onSmartSuggestionsClick,
    onSelectChange,
    onSelectAll,
    onClearAllSelect,
    searchForm,
    content,
    isAllSelected: selectedRowKeys.length === listPhrases.data?.items.length,
    isLoading: listPhrases.isLoading,
    isSuccess: listPhrases.isSuccess,
    listPhrasesDataLength: listPhrases?.data?.items?.length || 0,
    isDeleteLoading: deletePhrases.isLoading,
  };
};

export default useListPhrasesController;
