import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import {
  API_QUERY_KEY,
  openNotificationWithIcon,
  PAGE_SIZE,
} from '../../../../../../utills';
import { TableRowSelection } from 'antd/es/table/interface';
import useUser from '../../../../../../hooks/user';
import { useHistory, useParams } from 'react-router-dom';
import { ISortDataObject, IWorkspaceParams } from '../../../../../../types';
import { Button, Dropdown, Form, Menu, Tag, Tooltip } from 'antd';
import RightIcon from '../../../../../../images/icons/right-icon';
import EllipsisIcon from '../../../../../../images/icons/ellipsis-icon';
import moment from 'moment/moment';
import debounce from 'lodash.debounce';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import { nanoid } from 'nanoid';
import queryClient from '../../../../../../query-client';
import CrossRedIcon from '../../../../../../images/icons/cross-icon';
import {
  useGetSettingDetails,
  useGetUserPreference,
  useListSynonyms,
  usePatchSynonymsStatus,
  useUpdateSynonyms,
  useUpdateUserPreference,
} from '../../../services';
import useError from '../../../../../../hooks/error';
import usePermissions from '../../../../../../hooks/permissions';
import OneWayIcon from '../../../../../../images/icons/one-way-icon';
import TowWayIcon from '../../../../../../images/icons/two-way-icon';

const useListSmartSuggestionsController = (
  environment: string,
  setIsEnableSmartSuggestions: (
    isEnableSynonymsSmartSuggestions: boolean
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
    sortBy: 'created_at',
    orderBy: 'desc',
  });
  const [searchData, setSearchData] = useState('');
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  // eslint-disable-next-line
  const [synonymsId, setSynonymsId] = useState<any>([]);

  const [type, setType] = useState('');
  const [termName, setTermName] = useState<string | undefined>('');
  const [payLoadStatus, setPayLoadStatus] = useState('');

  const [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState(false);
  const [
    isEditSmartSuggestionModalVisible,
    setIsEditSmartSuggestionModalVisible,
  ] = useState(false);

  const radioOption = [
    { label: 'One Way', value: 'oneway' },
    { label: 'Two Way', value: 'twoway' },
  ];
  const [isFieldChange, setFieldChange] = useState(false);
  const [isTagChange, setTagChange] = useState(false);
  const [disableSave, setDisableSave] = useState(true);

  const [radioType, setRadioType] = useState('any');
  const [selectedSynonyms, setSelectedSynonyms] = useState<
    { id: string; text: string; className?: string }[]
  >([]);
  const [isStoreFound, setStoreFound] = useState<boolean>(true);
  const [isButtonVisible, setButtonVisible] = useState<boolean>(false);
  const [isLoadLibraryModalVisible, setLoadLibraryModalVisible] =
    useState(false);

  const uuid = nanoid();
  const permission = usePermissions();

  // eslint-disable-next-line
  const [columnData, setColumnData] = useState<any>([]);

  const userDetails = useUser();
  const getUserPreference = useGetUserPreference(
    workspaceId,
    'smart-suggestions-synonyms',
    userDetails?.user?.id
  );
  const getSettingDetails = useGetSettingDetails(workspaceId, 'SYNONYMS');

  const updateUserPreference = useUpdateUserPreference(workspaceId);
  // eslint-disable-next-line
  const listSmartSynonyms = useListSynonyms(
    workspaceId,
    environment,
    page,
    pageSize,
    columnSortOrder.sortBy,
    columnSortOrder.orderBy,
    searchData,
    type,
    false,
    true,
    status
  );

  const updateSmartSynonyms = useUpdateSynonyms(synonymsId, workspaceId);
  const publishSynonyms = usePatchSynonymsStatus(workspaceId);

  useError({
    mutation: updateSmartSynonyms,
    entity: t('common.labels.synonyms'),
  });

  useError({
    mutation: publishSynonyms,
    entity: t('common.labels.synonyms'),
  });

  const onUserPreferenceChange = (newValue: CheckboxValueType[]) => {
    const value: {
      preferenceName: string;
      preferenceValue: CheckboxValueType[];
      preferenceId?: string;
    } = {
      preferenceName: 'smart-suggestions-synonyms',
      preferenceValue: newValue,
    };

    if (userPreferenceId) {
      value['preferenceId'] = userPreferenceId;
    }
    updateUserPreference.mutate(value);
    setSelectedFields(newValue);
  };
  // eslint-disable-next-line
  const onDeleteClickSmartSuggestions = (item: any) => {
    setSynonymsId(item.id);
    setIsVisibleDeleteModal(true);
  };

  const onInputChange = debounce((searchValue) => {
    setSearchData(searchValue);
  }, 1000);

  const onDeleteSmartSuggestion = () => {
    if (synonymsId) {
      const payload = {
        synonymsIds: Array.isArray(synonymsId) ? synonymsId : [synonymsId],
        status: 'REJECTED',
        environment_id: environment,
      };
      setPayLoadStatus(payload.status);
      publishSynonyms.mutate(payload);
    }
  };
  // eslint-disable-next-line
  const onEditSmartSuggestionsClick = (item: any) => {
    setSynonymsId(item.id);
    form.setFieldsValue({
      term: item.canonicalForm,
      type: item.synonymsType,
    });

    if (selectedSynonyms.length === 0) {
      item.surfaceForm.forEach((item: string) => {
        setSelectedSynonyms((prevState) => [
          ...prevState,
          { id: uuid, text: item },
        ]);
      });
    }
    setIsEditSmartSuggestionModalVisible(true);
  };

  const onPublishRecord = (id: string) => {
    const payload = {
      synonymsIds: [id],
      status: 'PUBLISHED',
      environment_id: environment,
    };
    setPayLoadStatus(payload.status);
    publishSynonyms.mutate(payload);
  };
  // eslint-disable-next-line
  const onRejectRecord = (item: any) => {
    setSynonymsId(item.id);
    setTermName(item.canonicalForm);
    setIsVisibleDeleteModal(true);
  };

  const hideLoadLibraryModal = () => {
    setLoadLibraryModalVisible(false);
  };

  const onLoadLibraryClick = () => {
    setLoadLibraryModalVisible(true);
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
          } else if (status === 'PUBLISHED') {
            return <Tag color="success">Approved</Tag>;
          } else {
            return <Tag color="error">Rejected</Tag>;
          }
        },
      });
    }

    arr.push({
      title: t('common.labels.action'),
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
        title: t('common.labels.synonym_search_term'),
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
                            key={1}
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
      {
        title: t('common.labels.type'),
        dataIndex: 'synonymsType',
        key: 'synonymsType',
        width: '5%',
        render: (record: string) =>
          record === 'oneway' ? (
            <OneWayIcon />
          ) : record === 'twoway' ? (
            <TowWayIcon />
          ) : (
            '-'
          ),
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

  const content = [
    {
      label: t('common.labels.synonym_search_term'),
      value: 'term',
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
      listSmartSynonyms.data?.items.map((redirection) => redirection.id)
    );
  };

  const onClearAllSelect = () => {
    setSelectedRowKeys([]);
  };

  const onChangeStatus = (status: string) => {
    setPage(1);
    setStatus(status);
  };

  const onChangeType = (type: string) => {
    setPage(1);
    setType(type);
  };

  const pagination = useMemo(
    () => ({
      total: totalRecordCount,
      pageSize: pageSize,
      showSizeChanger: true,
      current: page,
      hideOnSinglePage: !!(totalRecordCount < PAGE_SIZE),
      pageSizeOptions: [5, 10, 20, 50, 100],
      locale: { items_per_page: '  per page' },
      onChange: (page: number, pageSize: number) => {
        setSelectedRowKeys([]);
        setPageSize(pageSize);
        setPage(page);
        listSmartSynonyms.remove();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize, totalRecordCount]
  );

  // eslint-disable-next-line
  const synonymsArray: any = [];

  selectedSynonyms.map((item) => {
    if (synonymsId) {
      if (item.text) {
        synonymsArray.push(item.text);
      } else {
        synonymsArray.push(item);
      }
    } else {
      synonymsArray.push(item.text);
    }
    return '';
  });

  // eslint-disable-next-line
  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: (e) => onSelectChange(e),
  };

  const onCancel = () => {
    setIsVisibleDeleteModal(false);
    setIsEditSmartSuggestionModalVisible(false);
    setSelectedRowKeys([]);
    setDisableSave(true);
  };

  const onClickBackToList = () => {
    history.push(`/workspaces/${workspaceId}/discovery/enrich/synonyms`);
  };

  const onSelectDeleteClick = () => {
    setIsVisibleDeleteModal(true);
    setSynonymsId(selectedRowKeys);
  };

  const onSelectPublishClick = () => {
    const payload = {
      synonymsIds: selectedRowKeys,
      status: 'PUBLISHED',
      environment_id: environment,
    };
    setPayLoadStatus(payload.status);
    publishSynonyms.mutate(payload);
  };

  const onSaveAndPublish = async () => {
    const values = await form.validateFields();
    const smartValues = {
      canonicalForm: values.term,
      synonymsType: values.type ? values.type : 'oneway',
      surfaceForm: synonymsArray,
      displayForm: synonymsArray,
      isApproved: true,
      environmentId: environment,
      status: 'PUBLISHED',
    };
    updateSmartSynonyms.mutate(smartValues);
  };

  const onChangeRadioType = ({ target: { value } }: RadioChangeEvent) => {
    setRadioType(value);
  };

  const onAddSynonym = (values: { id: string; text: string }) => {
    setTagChange(true);
    setSelectedSynonyms([
      ...selectedSynonyms,
      { id: values.id, text: values.text },
    ]);
  };

  const onDeleteSynonyms = (position: number) => {
    setTagChange(true);
    const tempDelete = selectedSynonyms.filter(
      (product, index) => index !== position
    );
    setSelectedSynonyms(tempDelete);
  };

  const typeOptions = useMemo(
    () => [
      { value: '', label: t('common.labels.any') },
      { value: 'oneway', label: t('common.labels.one_way') },
      { value: 'twoway', label: t('common.labels.two_way') },
    ],
    [t]
  );

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
    if (listSmartSynonyms.isSuccess) {
      if (listSmartSynonyms.data) {
        // eslint-disable-next-line
        // listSmartSynonyms?.data?.items?.map((item: any) => {
        //   return array.push({
        //     key: item.id,
        //     term: item,
        //     synonymType: item.synonymsType,
        //     synonyms: item.surfaceForm,
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

        if (listSmartSynonyms.data?.items) {
          setColumnData(
            listSmartSynonyms.data.items.map((item) => ({
              ...item,
              key: item.id,
            }))
          );
          setTotalRecordCount(listSmartSynonyms?.data?.totalRecord);
        }
        // setColumnData([...array]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listSmartSynonyms.isSuccess, listSmartSynonyms.data]);

  const onSettingClick = () => {
    history.push(
      `/workspaces/${workspaceId}/discovery/enrich/synonyms/settings`
    );
  };

  useEffect(() => {
    if (listSmartSynonyms.isError) {
      setColumnData([]);
    }
  }, [listSmartSynonyms.isError]);

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
          'synonym_type',
          'synonyms',
          'status',
          'actions',
        ]);
        columnValue(['term', 'synonym_type', 'synonyms', 'status', 'actions']);
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
    if (updateSmartSynonyms.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.LIST_SYNONYMS]);
      form.resetFields();
      setSelectedSynonyms([]);
      onCancel();
      openNotificationWithIcon(
        'success',
        t('common.messages.publish_successfully')
      );
    }
    // eslint-disable-next-line
  }, [workspaceId, updateSmartSynonyms.isSuccess]);

  useEffect(() => {
    if (publishSynonyms.isSuccess) {
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
      queryClient.removeQueries([API_QUERY_KEY.LIST_SYNONYMS]);
      onCancel();
    }
    // eslint-disable-next-line
  }, [publishSynonyms.isSuccess, t, workspaceId]);

  useEffect(() => {
    if (selectedRowKeys?.length === 1) {
      const name = listSmartSynonyms?.data?.items?.find(
        (item) => item.id === selectedRowKeys.toString()
      )?.canonicalForm;
      setTermName(name);
    }
    // eslint-disable-next-line
  }, [selectedRowKeys.length]);

  useEffect(() => {
    setStatus('');
    setType('');
    setSelectedRowKeys([]);
    setColumnSortOrder({
      sortBy: 'modified_at',
      orderBy: 'desc',
    });
  }, [environment]);

  useEffect(() => {
    if (
      (listSmartSynonyms.isSuccess &&
        listSmartSynonyms.data &&
        listSmartSynonyms.data?.items.length > 0) ||
      type ||
      status
    ) {
      setStoreFound(false);
      setButtonVisible(true);
    } else {
      setStoreFound(false);
      setButtonVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listSmartSynonyms.isSuccess, listSmartSynonyms.data]);

  useEffect(() => {
    if (listSmartSynonyms.isError) {
      if (
        // @ts-ignore
        listSmartSynonyms?.error?.response?.Error?.errorCode === 'EX-00047'
      ) {
        // @ts-ignore
        openNotificationWithIcon('error', listSmartSynonyms.error.message);
        setStoreFound(true);
      }
    }
    // eslint-disable-next-line
  }, [listSmartSynonyms.isError]);

  const onAddStore = () => {
    history.push(`/workspaces/${workspaceId}/apps`);
    setStoreFound(false);
  };

  const onFieldChange = () => {
    const values = form.getFieldsValue();
    if (values.term && synonymsArray.length > 0) {
      setFieldChange(true);
    } else {
      setFieldChange(false);
    }
  };

  const onHandleInputChange = (value: string) => {
    if (value) {
      setTagChange(true);
    }
    if (!value.length) {
      form.setFields([
        {
          name: 'synonyms',
          errors: [
            t('common.messages.required', {
              entity: t('common.labels.synonyms'),
            }),
          ],
        },
      ]);
    }
  };

  useEffect(() => {
    const values = form.getFieldsValue();
    if (
      (isFieldChange || isTagChange) &&
      values.term &&
      synonymsArray.length > 0
    ) {
      setDisableSave(false);
    } else {
      setDisableSave(true);
    }
    // eslint-disable-next-line
  }, [isFieldChange, isTagChange, synonymsId, selectedSynonyms]);

  return {
    t,
    form,
    columns,
    onUserPreferenceChange,
    userPreference,
    rowSelection,
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
    onInputChange,
    selectedSynonyms,
    radioOption,
    radioType,
    setType,
    onChangeRadioType,
    onAddSynonym,
    onDeleteSynonyms,
    onClickBackToList,
    type,
    status,
    statusOptions,
    typeOptions,
    workspaceId,
    termName,
    isAllSelected:
      selectedRowKeys.length === listSmartSynonyms.data?.items.length,
    onClearAllSelect,
    onSelectAll,
    onSelectChange,
    pagination,
    onAddStore,
    isStoreFound,
    isButtonVisible,
    content,
    disableSave,
    onFieldChange,
    onHandleInputChange,
    isLoadLibraryModalVisible,
    isDeleteLoading: publishSynonyms.isLoading && payLoadStatus === 'REJECTED',
    isPublishLoading:
      publishSynonyms.isLoading && payLoadStatus === 'PUBLISHED',
    onLoadLibraryClick,
    hideLoadLibraryModal,
    onSettingClick,
    isLoading: listSmartSynonyms.isLoading,
    isSuccess: listSmartSynonyms.isSuccess,
    addBigcommerceStorePermission:
      permission.canReadEcommerceStore() &&
      permission.canCreateEcommerceStore(),
    onChangeStatus,
    onChangeType,
  };
};

export default useListSmartSuggestionsController;
