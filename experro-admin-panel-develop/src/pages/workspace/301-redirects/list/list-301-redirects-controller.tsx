/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Dropdown, Form, Menu } from 'antd';
import { useDropzone } from 'react-dropzone';

import { I301Redirect, IWorkspaceParams, RowRecord } from '../../../../types';
import {
  APIS_ROUTES,
  convertDateTimeToUserTimezone,
  openNotificationWithIcon,
  PAGE_SIZE,
  sampleTemplateRedirection,
  SIDEBAR_KEYS,
} from '../../../../utills';
import useUser from '../../../../hooks/user';
import useError from '../../../../hooks/error';
import EllipsisIcon from '../../../../images/icons/ellipsis-icon';
import usePermissions from '../../../../hooks/permissions/permissions';
import {
  useCreate301Redirect,
  useDelete301Redirect,
  useImport301Redirect,
  useList301Redirects,
  useListEnvironments301Redirects,
  useListUsers301Redirects,
  useUpdate301Redirect,
} from '../services';
import { debounce } from 'lodash';
import moment from 'moment';

interface IUseList301RedirectsController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useList301RedirectsController = ({
  onMainSidebarActiveItem,
}: IUseList301RedirectsController) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const [importFileForm] = Form.useForm();
  const [importFile, setImportFile] = useState<File[]>();
  const scrollTopRef = useRef(null);

  const {
    canCreate301Redirect,
    canRead301Redirect,
    canUpdate301Redirect,
    canDelete301Redirect,
  } = usePermissions();

  const [isModalVisible, setIsModalVisible] = useState<boolean>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>();
  const [isImportModalVisible, setIsImportModalVisible] = useState<boolean>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isImportButtonDisable, setIsImportButtonDisable] =
    useState<boolean>(true);
  const [isDragDropVisible, setIsDragDropVisible] = useState<boolean>(true);
  const [redirectId, setRedirectId] = useState<string>('');
  const [filter, setFilter] = useState('');
  const [deleteRedirectIds, setDeleteRedirectIds] = useState<
    string[] | React.Key[]
  >([]);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [domain, setDomain] = useState<string>();
  // const [fileSize, setFileSize] = useState<string>();
  const [uploadClass, setUploadClass] = useState<string>('');
  const [editRedirectData, setEditRedirectData] = useState<I301Redirect>({});
  const [isOverRideModalVisible, setIsOverRideModalVisible] =
    useState<boolean>(false);
  // const [columnSortOrder, setColumnSortOrder] = useState({
  //   sortBy: '',
  //   orderBy: '',
  // });
  const [deleteSingleRedirect, setDeleteSingleRedirect] = useState<string>('');

  const user = useUser();
  const listAllUser = useListUsers301Redirects();
  const list301Redirects = useList301Redirects(
    page,
    pageSize,
    // columnSortOrder,
    workspaceId,
    filter
  );
  const create301Redirect = useCreate301Redirect(workspaceId);
  const update301Redirect = useUpdate301Redirect(workspaceId, redirectId);
  const delete301Redirect = useDelete301Redirect(workspaceId);
  const import301Redirect = useImport301Redirect(workspaceId);
  const listEnvironments = useListEnvironments301Redirects(workspaceId);

  // //@ts-ignore
  // const onChangeTable = (pagination, filters, sorter) => {
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
  //   list301Redirects.remove();
  // };

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

  const onDeleteImportedFile = () => {
    setIsDragDropVisible(true);
    setImportFile([]);
    setIsImportButtonDisable(true);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
    },
    onDrop: onDropFile,
  });

  useError({
    mutation: create301Redirect,
    entity: t('common.labels.301_redirects_title'),
  });

  useError({
    mutation: update301Redirect,
    entity: t('common.labels.301_redirects_title'),
  });

  useError({
    mutation: delete301Redirect,
    entity: t('common.labels.301_redirects_title'),
  });

  useError({
    mutation: import301Redirect,
    entity: t('common.labels.301_redirects_title'),
    cb: () => {
      setIsImportModalVisible(false);
      setIsImportButtonDisable(true);
      setIsDragDropVisible(true);
      importFileForm.resetFields();
      setImportFile([]);
    },
  });

  const onAddRedirect = () => {
    setIsModalVisible(true);
  };

  const onTestRedirect = useCallback(
    (redirectId: string, record: I301Redirect) => {
      window.open(`https://${domain}${record.oldUrl}`, '_blank');
    },
    [domain]
  );

  const onEditClick = useCallback(
    (redirectId: string, record: I301Redirect) => {
      setIsModalVisible(true);
      setRedirectId(redirectId);
      setIsEdit(true);

      setEditRedirectData({
        oldUrl: record.oldUrl,
        newUrl: record.newUrl,
      });
    },
    []
  );

  const onDeleteClick = useCallback((redirectId: string) => {
    setDeleteSingleRedirect(redirectId);
    setIsDeleteModalVisible(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.source_url'),
        dataIndex: 'oldUrl',
        key: 'oldUrl',
        // sorter: true,
        width: '25%',
        render: (oldUrl: string, record: RowRecord) => {
          return (
            <>
              <div className="ant-row ant-space-align-center ant-row-space-between w-100 table-text-button">
                <div className="table-text">
                  <div
                    onClick={
                      canRead301Redirect() && canUpdate301Redirect()
                        ? () => onEditClick(record.id, record)
                        : (e) => e.stopPropagation()
                    }
                    className={`${
                      canRead301Redirect() && canUpdate301Redirect()
                        ? 'text-blue cursor-pointer'
                        : ''
                    } text-truncate`}>
                    {record.oldUrl ? record.oldUrl : '-'}
                  </div>
                </div>

                {deleteRedirectIds &&
                  !(deleteRedirectIds.length > 0) &&
                  canRead301Redirect() && (
                    <Dropdown
                      placement="bottomRight"
                      trigger={['click']}
                      overlay={
                        <div className="table-dropdown">
                          <Menu>
                            <Menu.Item
                              // @ts-ignore
                              onClick={() => onTestRedirect(record.id, record)}>
                              {t('common.labels.test_redirect')}
                            </Menu.Item>

                            {canUpdate301Redirect() && (
                              // @ts-ignore
                              <Menu.Item
                                onClick={() => onEditClick(record.id, record)}>
                                {t('common.labels.edit')}
                              </Menu.Item>
                            )}

                            {canDelete301Redirect() && (
                              // @ts-ignore
                              <Menu.Item
                                onClick={() => onDeleteClick(record.id)}>
                                <p className="text-red m-0">
                                  {t('common.labels.delete')}
                                </p>
                              </Menu.Item>
                            )}
                          </Menu>
                        </div>
                      }>
                      <Button
                        type="text"
                        size="small"
                        className="on-hover"
                        icon={<EllipsisIcon />}
                        style={{ float: 'right' }}
                      />
                    </Dropdown>
                  )}
              </div>
            </>
          );
        },
      },
      {
        title: t('common.labels.destination_url'),
        dataIndex: 'newUrl',
        key: 'newUrl',
        width: '25%',
        // sorter: true,
        render: (newUrl: string, record: object) => (
          <>
            <div className="text-truncate with-pixel">
              {/*@ts-ignore*/}
              {record.newUrl ? record.newUrl : '-'}
            </div>
          </>
        ),
      },
      {
        title: t('common.labels.modified_on'),
        dataIndex: 'modifiedAt',
        key: 'modifiedAt',
        width: '25%',
        // sorter: true,
        render: (record: string): string => {
          return convertDateTimeToUserTimezone(record, user?.user?.timezone);
        },
      },
      {
        title: t('common.labels.user'),
        dataIndex: 'createdBy',
        key: 'createdBy',
        width: '25%',
        render: (record: string): string => {
          const user = listAllUser.data?.filter((users) => users.id === record);
          if (user?.length) {
            return `${user?.[0].firstName} ${user?.[0].lastName}`;
          } else {
            return '-';
          }
        },
      },
    ],
    [
      t,
      onDeleteClick,
      onEditClick,
      onTestRedirect,
      deleteRedirectIds,
      listAllUser.data,
      user?.user?.timezone,
      canRead301Redirect,
      canUpdate301Redirect,
      canDelete301Redirect,
      // columnSortOrder,
    ]
  );

  const hideDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setDeleteRedirectIds([]);
    setDeleteSingleRedirect('');
  };

  const onImportFileFormSubmit = async () => {
    if (list301Redirects.data && list301Redirects.data.totalCount > 0) {
      setIsImportModalVisible(false);
      setIsOverRideModalVisible(true);
      setIsImportButtonDisable(true);
      setIsDragDropVisible(true);
    } else {
      // @ts-ignore
      if (importFile[0].size > 5242880) {
        openNotificationWithIcon(
          'error',
          t('common.messages.max_file_size_error')
        );
      } else {
        // @ts-ignore
        import301Redirect.mutate(importFile[0]);
      }
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

  const onOverRideData = async () => {
    // @ts-ignore
    if (importFile[0].size > 5242880) {
      openNotificationWithIcon(
        'error',
        t('common.messages.max_file_size_error')
      );
    } else {
      // @ts-ignore
      import301Redirect.mutate(importFile[0]);
    }
  };

  const onDeleteRedirect = () => {
    if (deleteSingleRedirect) {
      delete301Redirect.mutate({ redirectIds: [deleteSingleRedirect] });
    } else {
      delete301Redirect.mutate({ redirectIds: deleteRedirectIds });
    }
  };

  const exportRedirects = useCallback(() => {
    return fetch(
      `${process.env.REACT_APP_API_URL}${APIS_ROUTES.WORKSPACES}/${workspaceId}/redirects/export`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          redirect_ids: deleteRedirectIds,
        }),
      }
    )
      .then((response) => response.blob())
      .then((blob) => URL.createObjectURL(blob))
      .then((href) => {
        Object.assign(document.createElement('a'), {
          href,
          download: `301-redirect-${moment().format('YYYYMMDDHHMM')}.csv`,
        }).click();
        setDeleteRedirectIds([]);
        openNotificationWithIcon(
          'success',
          t('common.messages.exported_successfully')
        );
      });
  }, [workspaceId, deleteRedirectIds, t]);

  const onTemplateClick = useMemo(() => sampleTemplateRedirection, []);

  useEffect(() => {
    if (delete301Redirect.isSuccess) {
      setDeleteRedirectIds([]);
      setIsDeleteModalVisible(false);
      setDeleteSingleRedirect('');
      setPage(1);
      openNotificationWithIcon(
        'success',
        t('common.messages.redirect_deleted_successfully')
      );
      list301Redirects.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delete301Redirect.isSuccess]);

  useEffect(() => {
    if (import301Redirect.isSuccess) {
      onHideOverRideModal();
      importFileForm.resetFields();
      setIsDragDropVisible(true);
      setIsImportButtonDisable(true);
      setPage(1);
      list301Redirects.refetch();
      setImportFile([]);
      openNotificationWithIcon(
        'success',
        t('common.messages.redirects_imported_successfully')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [import301Redirect.isSuccess]);

  const onDeleteMultipleData = () => {
    setIsDeleteModalVisible(true);
  };

  const onRedirectSelectChange = (id: any) => {
    setDeleteRedirectIds(id);
  };

  const onSelectAllRedirection = () => {
    setDeleteRedirectIds(
      // @ts-ignore
      list301Redirects.data?.items.map((redirection) => redirection.id)
    );
  };

  const onClearAllRedirection = () => {
    setDeleteRedirectIds([]);
  };

  const onFilterChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(event.target.value);
      setPage(1);
    },
    500
  );

  const pagination = useMemo(
    () => ({
      total: list301Redirects.data?.totalCount,
      pageSize: pageSize,
      showSizeChanger: true,
      current: page,
      hideOnSinglePage: !!(
        list301Redirects.data &&
        list301Redirects.data.totalCount &&
        list301Redirects.data.totalCount < PAGE_SIZE
      ),
      pageSizeOptions: [5, 10, 20, 50, 100],
      locale: { items_per_page: ' per page' },
      onChange: (page: number, pageSize: number) => {
        setDeleteSingleRedirect('');
        setDeleteRedirectIds([]);
        setPageSize(pageSize);
        setPage(page);
        list301Redirects.remove();
        // @ts-ignore
        scrollTopRef.current.scrollIntoView();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list301Redirects.data, page, pageSize]
  );

  useEffect(() => {
    setDeleteRedirectIds([]);
  }, [filter]);

  useEffect(() => {
    if (listEnvironments.isSuccess && listEnvironments.data) {
      listEnvironments.data.forEach((environment) => {
        if (environment.type === 'PRODUCTION') {
          if (environment.customDomain) {
            setDomain(environment.customDomain);
          } else if (environment.cacheDomain) {
            setDomain(environment.cacheDomain);
          } else {
            setDomain(environment.workspaceDomain);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listEnvironments.isSuccess, listEnvironments.data]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    t,
    list301Redirects,
    columns,
    isModalVisible,
    onAddRedirect,
    isDeleteModalVisible,
    hideDeleteModal,
    onDeleteRedirect,
    isEdit,
    isImportModalVisible,
    hideImportModal,
    setIsImportModalVisible,
    importFileForm,
    onImportFileFormSubmit,
    isImportButtonDisable,
    exportRedirects,
    isDragDropVisible,
    onDeleteMultipleData,
    addRedirectButtonLoading:
      create301Redirect.isLoading || update301Redirect.isLoading,
    importRedirectButtonLoading: import301Redirect.isLoading,
    deleteRedirectIds,
    onRedirectSelectChange,
    pagination,
    filter,
    onSelectAllRedirection,
    onClearAllRedirection,
    isAllRedirectionSelected:
      deleteRedirectIds.length === list301Redirects.data?.items.length,
    onTemplateClick,
    uploadClass,
    loading: delete301Redirect.isLoading,
    onFilterChange,
    editRedirectData,
    redirectId,
    setIsEdit,
    setIsModalVisible,
    canCreate301Redirect,
    canRead301Redirect,
    canDelete301Redirect,
    isOverRideModalVisible,
    onOverRideData,
    onHideOverRideModal,
    getRootProps,
    getInputProps,
    importFile,
    onDeleteImportedFile,
    deleteSingleRedirect,
    // onChangeTable,
    scrollTopRef,
  };
};

export default useList301RedirectsController;
