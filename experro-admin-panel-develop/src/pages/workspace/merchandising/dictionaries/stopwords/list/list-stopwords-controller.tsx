import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import debounce from 'lodash.debounce';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Dropdown, Form, Menu } from 'antd';
import moment from 'moment/moment';

import useUser from '../../../../../../hooks/user';
import {
  IListStopWords,
  ISortDataObject,
  IWorkspaceParams,
} from '../../../../../../types';
import {
  API_QUERY_KEY,
  openNotificationWithIcon,
  PAGE_SIZE,
} from '../../../../../../utills';
import EllipsisIcon from '../../../../../../images/icons/ellipsis-icon';
import queryClient from '../../../../../../query-client';
import {
  useDeleteStopWords,
  useGetSettingDetails,
  useGetUserPreference,
  useListStopWords,
  usePatchStopWordsStatus,
  useUpdateUserPreference,
} from '../../../services';
import useError from '../../../../../../hooks/error';
import usePermissions from '../../../../../../hooks/permissions';
import SparkleIcon from '../../../../../../images/icons/sparkle-icon';

const useListStopWordsController = (
  environment: string,
  setIsEnableStopWord: (isEnableStopWord: boolean) => void
) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const [form] = Form.useForm();
  const permission = usePermissions();
  const [selectedSortValue, setSelectedSortValue] =
    useState('recently_created');

  const [filter, setFilter] = useState('');
  const [columnSortOrder, setColumnSortOrder] = useState<ISortDataObject>({
    sortBy: 'modified_at',
    orderBy: 'desc',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  // eslint-disable-next-line
  const [columns, setColumns] = useState<any>([]);
  const [userPreference, setUserPreference] = useState<string[]>([]);
  const [userPreferenceId, setUserPreferenceId] = useState('');
  const [selectedFields, setSelectedFields] = useState<CheckboxValueType[]>([
    '',
  ]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState('');
  const [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState(false);
  // eslint-disable-next-line
  const [stopWordId, setStopWordId] = useState<any>([]);
  const [selectedStatus, setSelectedStatus] = useState('Unpublish');
  const [termName, setTermName] = useState('');
  const [isStoreFound, setStoreFound] = useState<boolean>(true);
  const [isButtonVisible, setButtonVisible] = useState<boolean>(false);
  const [columnData, setColumnData] = useState([{}]);
  const [searchForm] = Form.useForm();
  const userDetails = useUser();
  const getUserPreference = useGetUserPreference(
    workspaceId,
    'stopwords-list',
    userDetails?.user?.id
  );
  const updateUserPreference = useUpdateUserPreference(workspaceId);
  const listStopWords = useListStopWords(
    workspaceId,
    page,
    pageSize,
    columnSortOrder.sortBy,
    columnSortOrder.orderBy,
    searchData,
    environment
  );
  const getSettingDetails = useGetSettingDetails(workspaceId, 'STOPWORDS');

  const deleteStopWords = useDeleteStopWords(workspaceId, environment);

  const patchStopWordsStatus = usePatchStopWordsStatus(workspaceId);

  useError({
    mutation: deleteStopWords,
    entity: t('common.labels.stop_words'),
  });

  useError({
    mutation: patchStopWordsStatus,
    entity: t('common.labels.stop_words'),
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
      preferenceName: 'stopwords-list',
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
        setPageSize(pageSize);
        setPage(page);
        setSelectedRowKeys([]);
        listStopWords.remove();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize, totalRecordCount]
  );

  const onEditClickStopWords = (item: IListStopWords) => {
    form.setFieldsValue({
      term: item.canonicalForm,
    });
    setIsModalVisible(true);
    setStopWordId(item.id);
  };

  const onDeleteClickStopWords = (item: IListStopWords) => {
    setTermName(item.canonicalForm);
    setStopWordId([item.id]);
    setIsVisibleDeleteModal(true);
  };

  const onAddStopWord = () => {
    setIsModalVisible(true);
  };

  const onSettingClick = () => {
    history.push(
      `/workspaces/${workspaceId}/discovery/dictionaries/stop-words/settings`
    );
  };

  const onCancel = () => {
    setIsVisibleDeleteModal(false);
    setStopWordId([]);
    setSelectedRowKeys([]);
    setTermName('');
  };

  const onDeleteStopWords = () => {
    if (stopWordId) {
      deleteStopWords.mutate(stopWordId);
    }
  };

  const onSelectDeleteClick = () => {
    setStopWordId(selectedRowKeys);
    setIsVisibleDeleteModal(true);
  };

  const onSelectStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const onInputChange = debounce((searchValue) => {
    setSearchData(searchValue);
    setPage(1);
    setSelectedRowKeys([]);
  }, 1000);

  const onSelectSaveClick = () => {
    const payload = {
      stopWordsIds: selectedRowKeys,
      status: selectedStatus === 'Unpublish' ? 'UNPUBLISHED' : 'PUBLISHED',
    };
    patchStopWordsStatus.mutate(payload);
    setSelectedRowKeys([]);
  };

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
        render: (date: string) => moment(date).format('DD MMM, YYYY HH:mm A'),
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
        width:
          (getUserPreference?.data &&
            getUserPreference?.data.length > 0 &&
            getUserPreference.data[0].preferenceValue.length > 1) ||
          selectedFields?.length > 1
            ? '20%'
            : 'auto',
        render: (data: string, item: IListStopWords) => (
          <>
            {item && (
              <div
                className={`ant-row ant-row-middle ant-row-no-wrap table-text-button`}>
                <div
                  onClick={() => onEditClickStopWords(item)}
                  className="text-blue cursor-pointer text-truncate with-pixel-xs">
                  {item.canonicalForm}
                </div>
                {!item.isUserDefined && (
                  <div className="sparkle-icon">
                    <SparkleIcon />
                  </div>
                )}
                {!selectedRowKeys.length && (
                  <Dropdown
                    placement="bottomRight"
                    trigger={['click']}
                    overlay={
                      <div className="table-dropdown">
                        <Menu>
                          <Menu.Item onClick={() => onEditClickStopWords(item)}>
                            {t('common.labels.edit')}
                          </Menu.Item>
                          <Menu.Item
                            key={item.id}
                            className="text-red"
                            onClick={() => onDeleteClickStopWords(item)}>
                            <p className="text-red m-0">
                              {t('common.labels.delete')}
                            </p>
                          </Menu.Item>
                        </Menu>
                      </div>
                    }>
                    <Button
                      key="stopWordTerm"
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
      listStopWords.data?.items.map((redirection) => redirection.id)
    );
  };

  const onClearAllSelect = () => {
    setSelectedRowKeys([]);
  };
  useEffect(() => {
    // eslint-disable-next-line
    if (listStopWords.isSuccess) {
      if (listStopWords.data?.items) {
        setColumnData(
          listStopWords.data.items.map((item) => ({ ...item, key: item.id }))
        );
        setTotalRecordCount(listStopWords?.data?.totalRecord);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listStopWords.isSuccess, listStopWords.data]);

  useEffect(() => {
    if (listStopWords.isError) {
      setColumnData([]);
    }
  }, [listStopWords.isError]);

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
          setSelectedFields(['term']);
          setUserPreference(['term']);
          columnValue(['term']);
        }
      } else {
        setUserPreference(['term']);
        setSelectedFields(['term']);
        columnValue(['term']);
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
    if (deleteStopWords.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.deleted_successfully')
      );
      queryClient.removeQueries([API_QUERY_KEY.LIST_STOP_WORDS]);
      setPage(1);
      onCancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteStopWords.isSuccess, t, workspaceId]);

  useEffect(() => {
    if (patchStopWordsStatus.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      queryClient.removeQueries([API_QUERY_KEY.LIST_STOP_WORDS]);
      onCancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patchStopWordsStatus.isSuccess, t, workspaceId]);

  useEffect(() => {
    setStopWordId([]);
  }, [columnData]);

  useEffect(() => {
    if (
      (listStopWords.isSuccess &&
        listStopWords.data &&
        listStopWords.data?.items.length > 0) ||
      searchData
    ) {
      setButtonVisible(true);
      setStoreFound(true);
    } else {
      setButtonVisible(false);
      setStoreFound(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listStopWords.isSuccess, listStopWords.data]);

  useEffect(() => {
    if (listStopWords.isError) {
      // @ts-ignore
      if (listStopWords?.error.response.Error.errorCode === 'EX-00047') {
        // @ts-ignore
        openNotificationWithIcon('error', listStopWords.error.message);
        setStoreFound(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listStopWords.isError]);

  useEffect(() => {
    if (getSettingDetails?.isSuccess && getSettingDetails?.data) {
      setIsEnableStopWord(getSettingDetails?.data?.isEnabled);
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
  }, [environment]);

  useEffect(() => {
    if (selectedRowKeys.length === 1) {
      const record = listStopWords?.data?.items?.find(
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
    filter,
    form,
    columns,
    setFilter,
    sortingOptions,
    onUserPreferenceChange,
    userPreference,
    columnData,
    onSortByChange,
    totalRecordCount,
    isModalVisible,
    isVisibleDeleteModal,
    onCancel,
    stopWordId,
    termName,
    searchData,
    setIsModalVisible,
    setStopWordId,
    selectedRowKeys,
    selectedStatus,
    selectedSortValue,
    onDeleteStopWords,
    onSelectStatusChange,
    onSelectDeleteClick,
    onAddStopWord,
    onInputChange,
    onSelectSaveClick,
    onSettingClick,
    workspaceId,
    permission,
    onAddStore,
    onSelectChange,
    onSelectAll,
    onClearAllSelect,
    pagination,
    searchForm,
    isAllSelected: selectedRowKeys.length === listStopWords.data?.items.length,
    isLoading: listStopWords.isLoading || listStopWords.isFetching,
    isSuccess: listStopWords.isSuccess,
    listStopWordsLength: listStopWords?.data?.items?.length || 0,
    isDeleteLoading: deleteStopWords.isLoading,
    getPreferenceLoading:
      getUserPreference.isLoading || getUserPreference.isFetching,
  };
};

export default useListStopWordsController;
