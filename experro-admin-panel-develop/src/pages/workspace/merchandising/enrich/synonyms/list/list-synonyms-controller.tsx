import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Dropdown, Form, Menu, Tooltip } from 'antd';
import moment from 'moment/moment';
import debounce from 'lodash.debounce';
import { nanoid } from 'nanoid';

import {
  IListPhrases,
  IListSynonyms,
  ISortDataObject,
  IWorkspaceParams,
} from '../../../../../../types';
import useUser from '../../../../../../hooks/user';
import {
  API_QUERY_KEY,
  openNotificationWithIcon,
  PAGE_SIZE,
} from '../../../../../../utills';
import EllipsisIcon from '../../../../../../images/icons/ellipsis-icon';
import queryClient from '../../../../../../query-client';
import {
  useDeleteSynonyms,
  useGetSettingDetails,
  useGetUserPreference,
  useListSynonyms,
  usePatchSynonymsStatus,
  useUpdateUserPreference,
} from '../../../services';
import useError from '../../../../../../hooks/error';
import usePermissions from '../../../../../../hooks/permissions';
import SparkleIcon from '../../../../../../images/icons/sparkle-icon';
import OneWayIcon from '../../../../../../images/icons/one-way-icon';
import TwoWayIcon from '../../../../../../images/icons/two-way-icon';

const useListSynonymsController = (
  environment: string,
  setIsEnableSynonyms: (isEnableSynonyms: boolean) => void
) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const permission = usePermissions();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSortValue, setSelectedSortValue] =
    useState('recently_created');
  const [columnSortOrder, setColumnSortOrder] = useState<ISortDataObject>({
    sortBy: 'modified_at',
    orderBy: 'desc',
  });
  const [status, setStatus] = useState('PUBLISHED');
  const [type, setType] = useState('');

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

  const [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState(false);
  // eslint-disable-next-line
  const [synonymsId, setSynonymsId] = useState<any>([]);
  const [termName, setTermName] = useState<string | undefined>('');
  const [isButtonVisible, setButtonVisible] = useState<boolean>(false);

  const [selectedSynonyms, setSelectedSynonyms] = useState<
    { id: string; text: string; className?: string }[]
  >([]);
  const [columnData, setColumnData] = useState([{}]);
  const [searchForm] = Form.useForm();
  const userDetails = useUser();
  const getUserPreference = useGetUserPreference(
    workspaceId,
    'synonyms-list',
    userDetails?.user?.id
  );
  const getSettingDetails = useGetSettingDetails(workspaceId, 'SYNONYMS');
  const updateUserPreference = useUpdateUserPreference(workspaceId);
  const listSynonyms = useListSynonyms(
    workspaceId,
    environment,
    page,
    pageSize,
    columnSortOrder.sortBy,
    columnSortOrder.orderBy,
    searchData,
    type
  );

  const deleteSynonyms = useDeleteSynonyms(workspaceId, environment);
  const patchSynonymsUpdateStatus = usePatchSynonymsStatus(workspaceId);

  useError({
    mutation: deleteSynonyms,
    entity: t('common.labels.synonyms'),
  });

  useError({
    mutation: patchSynonymsUpdateStatus,
    entity: t('common.labels.synonyms'),
  });

  const sortingOptions = useMemo(
    () => [
      { value: 'recently_created', label: t('common.labels.recently_update') },
      { value: 'oldest_created', label: t('common.labels.oldest_update') },
    ],
    [t]
  );

  const statusOption = useMemo(
    () => [
      { value: '', label: t('common.labels.any') },
      { value: 'oneway', label: t('common.labels.one_way') },
      { value: 'twoway', label: t('common.labels.two_way') },
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
        listSynonyms.remove();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize, totalRecordCount]
  );

  const typeOption = useMemo(
    () => [
      { key: 'oneway', label: t('common.labels.one_way') },
      { key: 'twoway', label: t('common.labels.two_way') },
    ],
    [t]
  );

  const uuid = nanoid();

  // eslint-disable-next-line
  const onEditSynonyms = (record: any) => {
    form.setFieldsValue({
      term: record.canonicalForm,
      type: record.synonymsType,
    });

    if (selectedSynonyms.length === 0) {
      record.surfaceForm.forEach((item: string) => {
        setSelectedSynonyms((prevState) => [
          ...prevState,
          { id: uuid, text: item },
        ]);
      });
    }
    setIsModalVisible(true);
    setSynonymsId(record.id);
  };

  const onDeleteSynonymsClick = (item: IListSynonyms) => {
    setTermName(item.canonicalForm);
    setSynonymsId([item.id]);
    setIsVisibleDeleteModal(true);
  };

  const onAddSynonyms = () => {
    setIsModalVisible(true);
  };

  const onCancel = () => {
    setIsVisibleDeleteModal(false);
    setSynonymsId([]);
    setSelectedRowKeys([]);
  };

  const onDeleteSynonyms = () => {
    if (synonymsId) {
      deleteSynonyms.mutate(synonymsId);
    }
  };

  const onSelectDeleteClick = () => {
    setIsVisibleDeleteModal(true);
    setSynonymsId(selectedRowKeys);
  };

  const onSelectStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const onSelectSaveClick = () => {
    const payload = {
      synonymsIds: selectedRowKeys,
      status: selectedStatus === 'Unpublish' ? 'UNPUBLISHED' : 'PUBLISHED',
    };
    patchSynonymsUpdateStatus.mutate(payload);
    setSelectedRowKeys([]);
  };

  const onSettingClick = () => {
    history.push(
      `/workspaces/${workspaceId}/discovery/enrich/synonyms/settings`
    );
  };
  const onSmartSuggestionsClick = () => {
    history.push(
      `/workspaces/${workspaceId}/discovery/enrich/synonyms/smart-suggestions`
    );
  };

  const onInputChange = debounce((searchValue) => {
    setSearchData(searchValue);
    setPage(1);
    setSelectedRowKeys([]);
  }, 1000);

  const onUserPreferenceChange = (newValue: CheckboxValueType[]) => {
    const value: {
      preferenceName: string;
      preferenceValue: CheckboxValueType[];
      preferenceId?: string;
    } = {
      preferenceName: 'synonyms-list',
      preferenceValue: newValue,
    };

    if (userPreferenceId) {
      value['preferenceId'] = userPreferenceId;
    }
    updateUserPreference.mutate(value);
    setSelectedFields(newValue);
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
        render: (suggestedAt: string, item: IListSynonyms) => {
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
        // eslint-disable-next-line
        render: (data: string, item: any) => (
          <>
            {item && (
              <div
                className={`ant-row ant-row-middle ant-row-no-wrap table-text-button`}>
                <div
                  onClick={() => onEditSynonyms(item)}
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
                          <Menu.Item onClick={() => onEditSynonyms(item)}>
                            {t('common.labels.edit')}
                          </Menu.Item>
                          <Menu.Item
                            key={2}
                            className="text-red"
                            onClick={() => onDeleteSynonymsClick(item)}>
                            <p className="text-red m-0">
                              {t('common.labels.delete')}
                            </p>
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
        title: t('common.labels.type'),
        dataIndex: 'synonymsType',
        key: 'synonymsType',
        width: '5%',
        render: (record: string) => {
          if (record === 'oneway') {
            return (
              <div className="icon-24">
                <OneWayIcon />
              </div>
            );
          } else if (record === 'twoway') {
            return (
              <div className="icon-24">
                <TwoWayIcon />
              </div>
            );
          } else {
            return '-';
          }
        },
      },
      {
        title: t('common.labels.synonyms'),
        dataIndex: 'surfaceForm',
        key: 'surfaceForm',
        width: 'auto',
        render: (text: string[]) => (
          <>
            {text?.map((item, index) =>
              index < 2 ? (
                <>
                  <span>{index > 0 ? ', ' : ''}</span>
                  <span>{item}</span>
                </>
              ) : (
                ''
              )
            )}
            {text?.length > 2 && (
              <Dropdown
                className="filter-custom-dropdown"
                overlayClassName="dropdown-size-small"
                trigger={['hover']}
                placement="bottomRight"
                overlay={
                  <Menu>
                    {text.length > 2 &&
                      text.map(
                        (data, index) =>
                          index > 1 && <Menu.Item>{data}</Menu.Item>
                      )}
                  </Menu>
                }>
                <Button
                  type="link"
                  onClick={(e) => e.preventDefault()}
                  className="font-normal facets-custom">
                  +{text.length - 2}
                </Button>
              </Dropdown>
            )}
          </>
        ),
      },

      ...arr,
    ]);
  };

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
      listSynonyms.data?.items.map((redirection) => redirection.id)
    );
  };

  const onClearAllSelect = () => {
    setSelectedRowKeys([]);
  };

  useEffect(() => {
    // eslint-disable-next-line
    // const array: any[] = [];
    if (listSynonyms.isSuccess) {
      // listSynonyms?.data?.items?.map((item) => {
      //   return array.push({
      //     key: item.id,
      //     search_term: item,
      //     synonym_type: item.synonymsType,
      //     synonyms: item.surfaceForm,
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
      if (listSynonyms.data?.items) {
        setColumnData(
          listSynonyms.data.items.map((item) => ({ ...item, key: item.id }))
        );
        setTotalRecordCount(listSynonyms?.data?.totalRecord);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listSynonyms.isSuccess, listSynonyms.data]);

  useEffect(() => {
    if (listSynonyms.isError) {
      setColumnData([]);
    }
  }, [listSynonyms.isError]);

  const content = [
    {
      label: t('common.labels.search_term'),
      value: 'search_term',
      disabled: true,
    },
    {
      label: t('common.labels.type'),
      value: 'synonym_type',
      disabled: true,
    },
    {
      label: t('common.labels.synonyms'),
      value: 'synonyms',
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
          setSelectedFields(['search_term', 'synonym_type', 'synonyms']);
          setUserPreference(['search_term', 'synonym_type', 'synonyms']);
          columnValue(['search_term', 'synonym_type', 'synonyms']);
        }
      } else {
        setUserPreference(['search_term', 'synonym_type', 'synonyms']);
        setSelectedFields(['search_term', 'synonym_type', 'synonyms']);
        columnValue(['search_term', 'synonym_type', 'synonyms']);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getUserPreference.isSuccess,
    getUserPreference.data,
    selectedRowKeys.length,
  ]);

  useEffect(() => {
    if (getUserPreference.isError) {
      openNotificationWithIcon('error', 'Error in getting user Preference');
      setUserPreference(['modified_by', 'status', 'modified_on']);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserPreference.isError]);

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
    if (updateUserPreference.isError) {
      openNotificationWithIcon('error', 'Error in Update preference');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUserPreference.isError]);

  useEffect(() => {
    if (deleteSynonyms.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.deleted_successfully')
      );
      queryClient.removeQueries([API_QUERY_KEY.LIST_SYNONYMS]);
      setPage(1);
      onCancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteSynonyms.isSuccess, t, workspaceId]);

  useEffect(() => {
    if (patchSynonymsUpdateStatus.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      queryClient.removeQueries([API_QUERY_KEY.LIST_SYNONYMS]);
      onCancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patchSynonymsUpdateStatus.isSuccess, t, workspaceId]);

  useEffect(() => {
    if (
      (listSynonyms.isSuccess &&
        listSynonyms.data &&
        listSynonyms.data?.items.length > 0) ||
      searchData ||
      type
    ) {
      setButtonVisible(true);
      setStoreFound(true);
    } else {
      setButtonVisible(false);
      setStoreFound(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listSynonyms.isSuccess, listSynonyms.data]);

  useEffect(() => {
    if (listSynonyms.isError) {
      // @ts-ignore
      if (listSynonyms?.error.response.Error.errorCode === 'EX-00047') {
        // @ts-ignore
        openNotificationWithIcon('error', listSynonyms.error.message);
        setStoreFound(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listSynonyms.isError]);

  useEffect(() => {
    if (getSettingDetails?.isSuccess && getSettingDetails?.data) {
      setIsEnableSynonyms(getSettingDetails?.data?.isEnabled);
    }
    // eslint-disable-next-line
  }, [getSettingDetails?.data, getSettingDetails?.isSuccess]);

  useEffect(() => {
    searchForm.resetFields();
    setSearchData('');
    setSelectedRowKeys([]);
    setSelectedSortValue('recently_created');
    setType('');
    setColumnSortOrder({
      sortBy: 'modified_at',
      orderBy: 'desc',
    });
    // eslint-disable-next-line
  }, [environment]);

  useEffect(() => {
    if (selectedRowKeys.length === 1) {
      const record = listSynonyms?.data?.items?.find(
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
    selectedSynonyms,
    setSelectedSynonyms,
    sortingOptions,
    onUserPreferenceChange,
    userPreference,
    onSelectChange,
    columnData,
    pagination,
    totalRecordCount,
    isVisibleDeleteModal,
    onCancel,
    synonymsId,
    setSynonymsId,
    selectedRowKeys,
    onDeleteSynonyms,
    onSelectDeleteClick,
    onSelectSaveClick,
    onSortByChange,
    onInputChange,
    selectedStatus,
    status,
    setStatus,
    typeOption,
    type,
    setType,
    termName,
    onSelectStatusChange,
    onAddSynonyms,
    searchData,
    onSettingClick,
    isModalVisible,
    setIsModalVisible,
    onSmartSuggestionsClick,
    statusOption,
    workspaceId,
    onAddStore,
    permission,
    onSelectAll,
    onClearAllSelect,
    searchForm,
    content,
    isAllSelected: selectedRowKeys.length === listSynonyms.data?.items.length,
    isLoading: listSynonyms.isLoading,
    isSuccess: listSynonyms.isSuccess,
    listSynonymsDataLength: listSynonyms?.data?.items?.length || 0,
    isDeleteLoading: deleteSynonyms.isLoading,
  };
};

export default useListSynonymsController;
