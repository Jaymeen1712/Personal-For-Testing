import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Dropdown, Form, Menu, Tooltip } from 'antd';
import moment from 'moment/moment';
import Cookies from 'js-cookie';
import { useDropzone } from 'react-dropzone';

import useUser from '../../../../../../hooks/user';
import {
  IListAutoComplete,
  ISortDataObject,
  IWorkspaceParams,
} from '../../../../../../types';
import {
  API_QUERY_KEY,
  APIS_ROUTES,
  openNotificationWithIcon,
  PAGE_SIZE,
  sampleAutoComplete,
  USER_ACCESS_KEY,
} from '../../../../../../utills';
import EllipsisIcon from '../../../../../../images/icons/ellipsis-icon';
import queryClient from '../../../../../../query-client';
import {
  useDeleteAutoComplete,
  useGetSettingDetails,
  useGetUserPreference,
  useListAutoComplete,
  useUpdateUserPreference,
} from '../../../services';
import useError from '../../../../../../hooks/error';
import usePermissions from '../../../../../../hooks/permissions';
import useImportAutoComplete from '../../../services/enrich/auto-complete/import';
import SparkleIcon from '../../../../../../images/icons/sparkle-icon';

const useListStopWordsController = (
  environment: string,
  setIsEnableAutoComplete: (isEnableAutoComplete: boolean) => void
) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const permission = usePermissions();
  const [selectedSortValue, setSelectedSortValue] =
    useState('recently_created');
  const [selectedType, setSelectedType] = useState('');

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
  const [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState(false);
  // eslint-disable-next-line
  const [autoCompleteId, setAutoCompleteId] = useState<any>([]);
  const [termName, setTermName] = useState('');
  const [isStoreFound, setStoreFound] = useState<boolean>(true);
  const [isButtonVisible, setButtonVisible] = useState<boolean>(false);
  const [columnData, setColumnData] = useState([{}]);

  const [isImportModalVisible, setIsImportModalVisible] = useState<boolean>();
  const [isImportButtonDisable, setIsImportButtonDisable] =
    useState<boolean>(true);
  const [isDragDropVisible, setIsDragDropVisible] = useState<boolean>(true);
  const [isOverRideModalVisible, setIsOverRideModalVisible] =
    useState<boolean>(false);
  const [importFile, setImportFile] = useState<File[]>();
  const [uploadClass, setUploadClass] = useState<string>('');

  const [importFileForm] = Form.useForm();

  const userDetails = useUser();
  const getUserPreference = useGetUserPreference(
    workspaceId,
    'auto-complete-list',
    userDetails?.user?.id
  );
  const updateUserPreference = useUpdateUserPreference(workspaceId);
  const listAutoComplete = useListAutoComplete(
    workspaceId,
    page,
    pageSize,
    columnSortOrder.sortBy,
    columnSortOrder.orderBy,
    environment,
    selectedType
  );

  const getSettingDetails = useGetSettingDetails(workspaceId, 'AUTOSUGGESTER');
  const deleteAutoComplete = useDeleteAutoComplete(workspaceId);
  const importAutoCompleteFile = useImportAutoComplete(workspaceId);

  useError({
    mutation: deleteAutoComplete,
    entity: t('common.labels.stop_words'),
  });

  useError({
    mutation: importAutoCompleteFile,
    entity: t('common.labels.301_redirects_title'),
    cb: () => {
      setIsImportModalVisible(false);
      setIsImportButtonDisable(true);
      setIsDragDropVisible(true);
      importFileForm.resetFields();
      setImportFile([]);
    },
  });

  const onDropFile = (file: File[]) => {
    if (file.length === 0) {
      openNotificationWithIcon(
        'error',
        t('common.messages.file_format_not_supported')
      );
      setUploadClass('');
    }
    setImportFile(file);
    if (file.length > 0) {
      setIsDragDropVisible(false);
      setIsImportButtonDisable(false);
      setUploadClass('popup-height-upload');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
    },
    onDrop: onDropFile,
  });

  const sortingOptions = useMemo(
    () => [
      { value: 'recently_created', label: t('common.labels.recently_update') },
      { value: 'oldest_created', label: t('common.labels.oldest_update') },
    ],
    [t]
  );

  const typeOption = useMemo(
    () => [
      { value: '', label: t('common.labels.any') },
      { value: 'manual', label: t('common.labels.manual') },
      { value: 'dynamic', label: t('common.labels.dynamic') },
    ],
    [t]
  );

  const onSelectType = (type: string) => {
    setSelectedType(type);
  };

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
        sortBy: 'search_term',
      });
    } else if (sortValue === 'z_to_a') {
      setColumnSortOrder({
        orderBy: 'desc',
        sortBy: 'search_term',
      });
    }
  };

  const onUserPreferenceChange = (newValue: CheckboxValueType[]) => {
    const value: {
      preferenceName: string;
      preferenceValue: CheckboxValueType[];
      preferenceId?: string;
    } = {
      preferenceName: 'auto-complete-list',
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
        listAutoComplete.remove();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize, totalRecordCount]
  );

  const onEditClickStopWords = (item: { searchTerm: string; id: string }) => {
    setIsModalVisible(true);
    setAutoCompleteId(item.id);
  };

  const onDeleteClickStopWords = (item: { searchTerm: string; id: string }) => {
    setTermName(item.searchTerm);
    setAutoCompleteId([item.id]);
    setIsVisibleDeleteModal(true);
  };

  const onAddAutoComplete = () => {
    setIsModalVisible(true);
  };

  const onSettingClick = () => {
    history.push(
      `/workspaces/${workspaceId}/discovery/enrich/auto-complete/settings`
    );
  };

  const onCancel = () => {
    setIsVisibleDeleteModal(false);
    setAutoCompleteId([]);
    setSelectedRowKeys([]);
  };

  const onDeleteAutoComplete = () => {
    if (autoCompleteId) {
      deleteAutoComplete.mutate(autoCompleteId);
    }
  };

  const onSelectDeleteClick = () => {
    setAutoCompleteId(selectedRowKeys);
    setIsVisibleDeleteModal(true);
  };

  const onTemplateClick = useMemo(() => sampleAutoComplete, []);

  const onDeleteImportedFile = () => {
    setIsDragDropVisible(true);
    setImportFile([]);
    setIsImportButtonDisable(true);
  };

  const onOverRideData = async () => {
    // @ts-ignore
    if (importFile[0].size > 5242880) {
      openNotificationWithIcon(
        'error',
        t('common.messages.max_file_size_error')
      );
    } else {
      // @ts-ignore
      importAutoCompleteFile.mutate(importFile[0]);
    }
  };

  const onImportFileFormSubmit = async () => {
    setIsImportModalVisible(false);
    setIsDragDropVisible(true);
    // @ts-ignore
    if (importFile[0].size > 5242880) {
      openNotificationWithIcon(
        'error',
        t('common.messages.max_file_size_error')
      );
    } else {
      // @ts-ignore
      importAutoCompleteFile.mutate(importFile[0]);
    }
  };

  const hideImportModal = () => {
    setIsImportModalVisible(false);
    setIsImportButtonDisable(true);
    setImportFile([]);
    setIsDragDropVisible(true);
    importFileForm.resetFields();
  };

  const onHideOverRideModal = () => {
    setIsImportModalVisible(false);
    setIsImportButtonDisable(true);
    setIsDragDropVisible(true);
    setIsOverRideModalVisible(false);
    importFileForm.resetFields();
    setImportFile([]);
  };

  useEffect(() => {
    columnValue(userPreference);
    // eslint-disable-next-line
  }, [userPreference]);

  const columnValue = (selectedCheckboxOfFields: CheckboxValueType[]) => {
    const arr = [];

    // if (selectedCheckboxOfFields.includes('type')) {
    //   arr.push({
    //     title: t('common.labels.type'),
    //     dataIndex: 'type',
    //     key: 'type',
    //     width: 'auto',
    //   });
    // }

    if (selectedCheckboxOfFields.includes('created_at')) {
      arr.push({
        title: t('common.labels.created_at'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 'auto',
        render: (date: string) => moment(date).format('DD MMM, YYYY HH:mm A'),
      });
    }

    if (selectedCheckboxOfFields.includes('modified_at')) {
      arr.push({
        title: t('common.labels.modified_at'),
        dataIndex: 'modifiedAt',
        key: 'modifiedAt',
        width: 'auto',
        render: (date: string) => moment(date).format('DD MMM, YYYY HH:mm A'),
      });
    }

    if (selectedCheckboxOfFields.includes('modified_by')) {
      arr.push({
        title: t('common.labels.modified_by'),
        dataIndex: 'modifiedBy',
        key: 'modifiedBy',
        width: 'auto',
        render: (text: string) => (
          <>
            {userDetails?.listAllUser?.[text]
              ? userDetails?.listAllUser?.[text]
              : '-'}
          </>
        ),
      });
    }
    setColumns([
      {
        title: t('common.labels.search_term'),
        dataIndex: 'searchTerm',
        key: 'searchTerm',
        width:
          (getUserPreference?.data &&
            getUserPreference?.data.length > 0 &&
            getUserPreference.data[0].preferenceValue.length > 1) ||
          selectedFields?.length > 1
            ? '20%'
            : 'auto',
        render: (
          searchTerm: string,
          item: { searchTerm: string; id: string }
        ) => (
          <>
            {item && (
              <div
                className={`ant-row ant-row-middle ant-row-no-wrap table-text-button`}>
                <div
                  onClick={() => onEditClickStopWords(item)}
                  className="text-blue cursor-pointer text-truncate with-pixel-xs">
                  {item.searchTerm}
                </div>
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
      {
        title: '',
        dataIndex: '',
        key: '',
        width: '16px',
        className: 'sparkle-icon-col',
        render: (data: string, item: IListAutoComplete) => {
          if (item.type === 'dynamic') {
            return (
              <>
                <Tooltip
                  title={t('common.messages.auto_complete_smart_search')}>
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
        title: t('common.labels.created_by'),
        dataIndex: 'createdBy',
        key: 'createdBy',
        width: 'auto',
        render: (text: string) => (
          <>
            {userDetails?.listAllUser?.[text]
              ? userDetails?.listAllUser?.[text]
              : '-'}
          </>
        ),
      },
      ...arr,
    ]);
  };

  const onSelectChange = useCallback(
    // eslint-disable-next-line
    (autoCompleteObject: any) => {
      if (
        selectedRowKeys.findIndex(
          (selectedRecord) => selectedRecord === autoCompleteObject.key
        ) === -1
      ) {
        setSelectedRowKeys([...selectedRowKeys, autoCompleteObject.key]);
      } else {
        setSelectedRowKeys(
          selectedRowKeys.filter(
            (selectedRecord) => selectedRecord !== autoCompleteObject.key
          )
        );
      }
    },
    [selectedRowKeys]
  );

  const onSelectAll = () => {
    setSelectedRowKeys(
      // @ts-ignore
      listAutoComplete.data?.items.map((autoComplete) => autoComplete.id)
    );
  };

  const onClearAllSelect = () => {
    setSelectedRowKeys([]);
  };

  const onImportFileClick = () => {
    setIsDragDropVisible(true);
    setIsImportModalVisible(true);
  };

  const onExportFileClick = useCallback(() => {
    return fetch(
      `${process.env.REACT_APP_API_URL}${APIS_ROUTES.SEARCH_SERVICE}/${workspaceId}/auto-suggester/export`,
      {
        method: 'POST',
        // @ts-ignore
        headers: {
          'x-tenant-id': Cookies.get(USER_ACCESS_KEY.TENANT_ID),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auto_suggester_ids: selectedRowKeys,
        }),
      }
    )
      .then((response) => response.blob())
      .then((blob) => URL.createObjectURL(blob))
      .then((href) => {
        Object.assign(document.createElement('a'), {
          href,
          download: `Auto-complete-${moment().format('YYYYMMDDHHMM')}.csv`,
        }).click();
        setSelectedRowKeys([]);
        openNotificationWithIcon(
          'success',
          t('common.messages.exported_successfully')
        );
      });
  }, [workspaceId, selectedRowKeys, t]);

  useEffect(() => {
    // eslint-disable-next-line
    if (listAutoComplete.isSuccess) {
      if (listAutoComplete.data?.items) {
        setColumnData(
          listAutoComplete.data.items.map((item) => ({ ...item, key: item.id }))
        );
        setTotalRecordCount(listAutoComplete?.data?.totalCount);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listAutoComplete.isSuccess, listAutoComplete.data]);

  useEffect(() => {
    if (listAutoComplete.isError) {
      setColumnData([]);
    }
  }, [listAutoComplete.isError]);

  useEffect(() => {
    if (getUserPreference.isSuccess) {
      if (getUserPreference.data.length > 0) {
        if (getUserPreference.data[0].preferenceValue.length > 0) {
          setUserPreference(getUserPreference.data[0].preferenceValue);
          setUserPreferenceId(getUserPreference.data[0].id);
          columnValue(getUserPreference.data[0].preferenceValue);
        } else {
          setUserPreferenceId(getUserPreference.data[0].id);
          columnValue(['searchTerm', 'createdBy']);
        }
      } else {
        setUserPreference(['searchTerm', 'createdBy']);
        columnValue(['searchTerm', 'createdBy']);
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
    // eslint-disable-next-line
  }, [updateUserPreference.isSuccess]);

  useEffect(() => {
    if (deleteAutoComplete.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.deleted_successfully')
      );
      queryClient.removeQueries([API_QUERY_KEY.LIST_AUTO_COMPLETE]);
      setPage(1);
      onCancel();
    }
    // eslint-disable-next-line
  }, [deleteAutoComplete.isSuccess, t, workspaceId]);

  useEffect(() => {
    setAutoCompleteId([]);
  }, [columnData]);

  useEffect(() => {
    if (
      listAutoComplete.isSuccess &&
      listAutoComplete.data &&
      listAutoComplete.data?.items.length > 0
    ) {
      setButtonVisible(true);
      setStoreFound(true);
    } else {
      setButtonVisible(false);
      setStoreFound(true);
    }
    // eslint-disable-next-line
  }, [listAutoComplete.isSuccess, listAutoComplete.data]);

  useEffect(() => {
    if (listAutoComplete.isError) {
      // @ts-ignore
      if (listAutoComplete?.error.response.Error.errorCode === 'EX-00047') {
        // @ts-ignore
        openNotificationWithIcon('error', listAutoComplete.error.message);
        setStoreFound(false);
      }
    }
    // eslint-disable-next-line
  }, [listAutoComplete.isError]);

  useEffect(() => {
    if (getSettingDetails?.isSuccess && getSettingDetails?.data) {
      setIsEnableAutoComplete(getSettingDetails?.data?.isEnabled);
    }
    // eslint-disable-next-line
  }, [getSettingDetails?.data, getSettingDetails?.isSuccess]);

  useEffect(() => {
    setSelectedSortValue('recently_created');
    setSelectedRowKeys([]);
    setColumnSortOrder({
      sortBy: 'modified_at',
      orderBy: 'desc',
    });
    // eslint-disable-next-line
  }, [environment]);

  const onAddStore = () => {
    history.push(`/workspaces/${workspaceId}/platforms`);
    setStoreFound(true);
  };

  useEffect(() => {
    if (importAutoCompleteFile.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.redirects_imported_successfully')
      );
      setIsImportModalVisible(false);
      setIsImportButtonDisable(true);
      setImportFile([]);
      queryClient.removeQueries([API_QUERY_KEY.LIST_AUTO_COMPLETE]);
    }
    // eslint-disable-next-line
  }, [importAutoCompleteFile.isSuccess]);

  return {
    t,
    termName,
    columns,
    isStoreFound,
    isButtonVisible,
    isModalVisible,
    isVisibleDeleteModal,
    isImportModalVisible,
    isImportButtonDisable,
    isDragDropVisible,
    isOverRideModalVisible,
    importFile,
    autoCompleteId,
    sortingOptions,
    selectedRowKeys,
    selectedSortValue,
    totalRecordCount,
    userPreference,
    columnData,
    onSelectChange,
    permission,
    pagination,
    importFileForm,
    onExportFileClick,
    onTemplateClick,
    uploadClass,
    onUserPreferenceChange,
    onSortByChange,
    onCancel,
    setIsModalVisible,
    setAutoCompleteId,
    onDeleteAutoComplete,
    onSelectDeleteClick,
    onAddAutoComplete,
    onSettingClick,
    onAddStore,
    onSelectAll,
    onClearAllSelect,
    onImportFileFormSubmit,
    onOverRideData,
    getRootProps,
    getInputProps,
    onDeleteImportedFile,
    hideImportModal,
    onHideOverRideModal,
    onImportFileClick,
    typeOption,
    onSelectType,
    selectedType,
    isDeleteLoading: deleteAutoComplete.isLoading,
    importButtonLoading: importAutoCompleteFile.isLoading,
    isAllSelected:
      selectedRowKeys.length === listAutoComplete.data?.items.length,
    isLoading: listAutoComplete.isLoading || listAutoComplete.isFetching,
    isSuccess: listAutoComplete.isSuccess,
    listAutoCompleteLength: listAutoComplete?.data?.items?.length || 0,
  };
};

export default useListStopWordsController;
