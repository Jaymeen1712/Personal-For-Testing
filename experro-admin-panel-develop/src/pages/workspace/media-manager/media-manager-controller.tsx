import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MenuInfo } from 'rc-menu/lib/interface';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Dropdown, Menu, Tooltip } from 'antd';

import FolderIcon from '../../../images/icons/folder-icon';
import FolderOpenIcon from '../../../images/icons/folder-open-icon';
import {
  IFolder,
  IFolderBreadcrumb,
  ITreeFolder,
  IWorkspaceParams,
} from '../../../types';
import useQuery from '../../../hooks/queryParameter';
import {
  API_QUERY_KEY,
  APIS_ROUTES,
  convertAndFormatDate,
  formatFileSize,
  SIDEBAR_KEYS,
} from '../../../utills';
import useUser from '../../../hooks/user';
import useWorkspaceRoute from '../../../hooks/workspace-route';
import queryClient from '../../../query-client';
import EllipsisIcon from '../../../images/icons/ellipsis-icon';
import usePermissions from '../../../hooks/permissions';
import PlusArrowIcon from '../../../images/icons/plusarrow-icon';
import { useDetailsFile, useListFile, useListFolder } from './services';
import { useListAllUser } from './services/user';

const useMediaManagerController = (
  hideMenu?: boolean,
  onMainSidebarActiveItem?: (val: string) => void
) => {
  const { t } = useTranslation();
  const query = useQuery();
  const history = useHistory();
  const { push } = useWorkspaceRoute();
  const queryFolderId: string | null = query.get('folder');
  const fileId: string | null = query.get('file');
  const { workspaceId } = useParams<IWorkspaceParams>();
  const [currentFolderId, setCurrentFolderId] = useState('');
  const [breadcrumbItems, setBreadcrumbItems] = useState<IFolderBreadcrumb[]>(
    []
  );
  const [
    isCreateUpdateFolderModalVisible,
    setIsCreateUpdateFolderModalVisible,
  ] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<IFolder | undefined>();
  const [openFolderIds, setOpenFolderIds] = useState<string[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  const files = useListFile(workspaceId, currentFolderId);
  const folders = useListFolder(workspaceId);
  const fileDetails = useDetailsFile(workspaceId, currentFolderId, fileId);
  const user = useUser();
  const allUsers = useListAllUser();
  const [inProgress, setInProgress] = useState(false);
  const [isFilesEmpty, setFilesEmpty] = useState(false);
  const [pageNum, setPageNum] = useState<number>(1);
  const [selectedFiles, setSelectedFiles] = useState<string[] | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [isFileEdited, setFileEdited] = useState(false);
  const permissions = usePermissions();
  const [isResetFilesFilter, setResetFilesFilter] = useState(false)

  const parentFolderId: string | undefined = folders?.data?.find(
    (folder: IFolder) => folder.id === currentFolderId
  )?.parentFolderId;

  const refetchFolderData = useCallback(() => {
    queryClient.refetchQueries([
      API_QUERY_KEY.FILE_LIST,
      workspaceId,
      currentFolderId,
    ]);
    queryClient.refetchQueries([
      API_QUERY_KEY.SUB_FOLDER_LIST,
      workspaceId,
      currentFolderId,
    ]);
  }, [currentFolderId, workspaceId]);

  const onDeleteFile = useCallback(() => {
    setTimeout(() => {
      refetchFolderData();
      push(`/media-manager?folder=${currentFolderId}`);
    }, 2000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFolderId, push, refetchFolderData]);

  // eslint-disable-next-line
  const onCreateClick = useCallback((event?: any) => {
    event?.stopPropagation();
    setIsCreateUpdateFolderModalVisible(true);
  }, []);

  const onRenameClick = useCallback(
    (folderId: string, e?: React.MouseEvent<HTMLElement>) => {
      e?.stopPropagation();

      const folder = folders.data?.find((folder) => folder.id === folderId);
      if (folder) {
        setSelectedFolder(folder);
        setIsCreateUpdateFolderModalVisible(true);
      }
    },
    [folders.data]
  );

  const onDeleteClick = useCallback(
    (folderId: string, e?: React.MouseEvent<HTMLElement>) => {
      e?.stopPropagation();

      const folder = folders.data?.find((folder) => folder.id === folderId);
      if (folder) {
        setSelectedFolder(folder);
        setIsDeleteModalVisible(true);
      }
    },
    [folders.data]
  );

  const hideCreateUpdateFolderModal = useCallback(() => {
    setIsCreateUpdateFolderModalVisible(false);
    setSelectedFolder(undefined);
  }, []);

  const hideDeleteModal = useCallback(() => {
    setIsDeleteModalVisible(false);
    setSelectedFolder(undefined);
  }, []);

  const file = useMemo(() => {
    if (fileDetails.data) {
      const file = fileDetails.data;
      const createdByUser = allUsers.data?.find(
        (user) => user.id === file.createdBy
      );
      return {
        ...file,
        createdByUser: createdByUser
          ? `${createdByUser.firstName} ${createdByUser.lastName}`
          : '',
        createdAt: convertAndFormatDate(
          file.createdAt,
          user?.user?.timezone,
          'DD MMM YYYY | hh:mm:ss A'
        ),
        modifiedAt: convertAndFormatDate(
          file.modifiedAt,
          user?.user?.timezone,
          'DD MMM YYYY | hh:mm:ss A'
        ),
        sizeWithFormat: formatFileSize(file.size),
      };
    }
  }, [user, allUsers.data, fileDetails.data]);

  const fileDownloadLink = useMemo(
    () =>
      `${process.env.REACT_APP_API_URL}${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/files/${fileId}/download?extension=${file?.type}&name=${file?.name}`,
    [file, fileId, workspaceId]
  );

  const getFolderItem = useCallback(
    (folder: IFolder) => ({
      key: folder.id,
      label: (
        <>
          <div className="ant-row ant-row-space-between ant-row-middle">
            {!folder.isAllMedia ? (
              <Tooltip
                placement="bottom"
                mouseLeaveDelay={0}
                title={folder.name}>
                {folder.name}
              </Tooltip>
            ) : (
              <>
                <span className="cursor-pointer">{folder.name}</span>
                <div className="ant-menu-submenu-arrows">
                  {folder.isAllMedia && (
                    <Button
                      type="link"
                      size="small"
                      disabled={!!fileId}
                      className="plusarrow"
                      onClick={(event) => onCreateClick(event)}>
                      <PlusArrowIcon />
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="ant-row media-menu-button ant-row-space-between">
            {!folder.isAllMedia && (
              <div className="ant-row ant-row-middle ant-row-no-wrap ant-row-space-between media-menu-button-dots">
                <Dropdown
                  placement="bottomRight"
                  trigger={['click']}
                  overlay={
                    <div
                      className={`table-dropdown ${
                        (isCreateUpdateFolderModalVisible ||
                          isDeleteModalVisible) &&
                        'ant-dropdown-hidden'
                      }`}>
                      <Menu>
                        <Menu.Item
                          onClick={(event) => {
                            event.domEvent.stopPropagation();
                            setIsCreateUpdateFolderModalVisible(true);
                            onRenameClick(folder.id);
                          }}>
                          {t('common.labels.rename')}
                        </Menu.Item>
                        <Menu.Item
                          onClick={(event) => {
                            event.domEvent.stopPropagation();
                            onDeleteClick(folder.id);
                          }}>
                          <span className="text-red">
                            {t('common.labels.delete')}
                          </span>
                        </Menu.Item>
                      </Menu>
                    </div>
                  }>
                  <Button
                    type="text"
                    size="small"
                    onClick={(event) => event.stopPropagation()}
                    className="on-hover"
                    icon={<EllipsisIcon />}
                    style={{ float: 'right' }}></Button>
                </Dropdown>
              </div>
            )}
          </div>
        </>
      ),
      className: currentFolderId === folder.id ? 'folder-selected' : '',
      parentFolderId: folder.parentFolderId,
      icon: (
        <>
          {!folder.isAllMedia && (
            <div className="folders-icon ant-row">
              <div className="unselected-icon">
                {!folder.isAllMedia && <FolderIcon />}
              </div>
              <div className="selected-icon">
                <FolderOpenIcon />
              </div>
            </div>
          )}
        </>
      ),
    }),
    [
      t,
      fileId,
      onRenameClick,
      onCreateClick,
      onDeleteClick,
      isCreateUpdateFolderModalVisible,
      isDeleteModalVisible,
      currentFolderId,
    ]
  );

  const generateBreadCrumbItems = useCallback(
    (
      breadcrumbs: IFolderBreadcrumb[],
      parentId?: string
    ): IFolderBreadcrumb[] => {
      let folder: IFolder | undefined;
      if (parentId) {
        folder = folders.data?.find((folder) => folder.id === parentId);
      } else {
        folder = folders.data?.find((folder) => folder.isAllMedia);
      }

      if (folder && breadcrumbs[0].key.toString() !== folder.id.toString()) {
        breadcrumbs = [
          { key: folder.id, label: folder.name, type: 'folder' },
          ...breadcrumbs,
        ];
        if (!folder.isAllMedia) {
          return generateBreadCrumbItems(breadcrumbs, folder.parentFolderId);
        }
      }

      return breadcrumbs;
    },
    [folders.data]
  );

  const addChildren = useCallback(
    (parentFolder: ITreeFolder, folders: IFolder[]) => {
      const children = folders
        .filter((folder) => folder.parentFolderId === parentFolder.key)
        .map((child) => getFolderItem(child));

      if (children.length) {
        parentFolder.children = children;
        parentFolder.children.map((child) => addChildren(child, folders));
      }

      return parentFolder;
    },
    [getFolderItem]
  );

  const onSubSidebarMenuItemClick = useCallback(
    (menu: MenuInfo) => {
      if (!hideMenu) {
        history.push(
          `/workspaces/${workspaceId}/media-manager?folder=${menu.key}`
        );
      } else {
        setCurrentFolderId(menu.key);
      }
    },
    [history, workspaceId, hideMenu]
  );

  useEffect(() => {
    setPageNum(1);
  }, [currentFolderId]);

  const menuItems = useMemo(() => {
    if (!folders.data || folders.data.length === 0) return [];
    const rootFolder = folders.data.find((folder) => folder.isAllMedia);
    if (rootFolder) {
      return [addChildren(getFolderItem(rootFolder), folders.data)];
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addChildren, folders.data, getFolderItem, currentFolderId]);

  const onSubSidebarOpenChange = useCallback(
    (key: string) => {
      if (currentFolderId && openFolderIds.length !== 0) {
        if (!hideMenu) {
          history.push(
            `/workspaces/${workspaceId}/media-manager?folder=${key}`
          );
        } else {
          setCurrentFolderId(key);
        }
      }
    },
    [currentFolderId, history, openFolderIds.length, workspaceId, hideMenu]
  );

  useEffect(() => {
    if (!queryFolderId && folders.data?.length) {
      const allMediaFolder = folders.data?.find((folder) => folder.isAllMedia);
      if (allMediaFolder) {
        if (!hideMenu) {
          history.push(
            `/workspaces/${workspaceId}/media-manager?folder=${allMediaFolder.id}`
          );
        } else {
          setCurrentFolderId(allMediaFolder.id);
        }
        setOpenFolderIds([allMediaFolder.id]);
      }
    }
  }, [folders.data, queryFolderId, hideMenu, history, workspaceId]);

  useEffect(() => {
    if (queryFolderId) {
      setCurrentFolderId(queryFolderId);
    }
  }, [queryFolderId]);

  useEffect(() => {
    const selectedFolder = folders.data?.find(
      (folder) => folder.id === currentFolderId
    );
    if (selectedFolder) {
      const breadcrumbs = generateBreadCrumbItems(
        [
          {
            label: selectedFolder.name,
            key: selectedFolder.id,
            type: 'folder',
          },
        ],
        selectedFolder.parentFolderId
      );

      setOpenFolderIds(breadcrumbs.map((item) => item.key));
      if (!files.isFetching && !folders.isFetching && !files.isLoading) {
        if (file) {
          breadcrumbs.push({
            key: file.id,
            label: `${file.name}.${file.type}`,
            type: 'file',
          });
        }
        setBreadcrumbItems(breadcrumbs);
      }
    }
  }, [
    currentFolderId,
    folders.data,
    generateBreadCrumbItems,
    file,
    files.isFetching,
    files.isLoading,
    folders.isFetching,
  ]);

  useEffect(() => {
    if (fileDetails.isError) {
      push(`/media-manager?folder=${currentFolderId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileDetails.isSuccess]);

  useEffect(() => {
    if (!hideMenu && folders?.data?.length === 1) {
      history.push(
        `/workspaces/${workspaceId}/media-manager?folder=${folders?.data[0].id}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folders?.data]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.MEDIA_MANAGER);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSetUploadButtonUploading = (val: boolean) => {
    setIsUploading(val);
  };

  const refreshFolderList = () => {
    folders.refetch();
  };

  const onFileEdited = () => {
    setFileEdited(true);
    fileDetails.refetch();
  };

  const updateFileEdited = (isEdited: boolean) => {
    setFileEdited(isEdited);
  };

  const updateResetFilesFilter = (isReset: boolean) => {
    setResetFilesFilter(isReset)
  }

  return {
    t,
    files,
    workspaceId,
    folderId: currentFolderId,
    fileId,
    file,
    fileDownloadLink,
    refetchFolderData,
    onCreateClick,
    hideCreateUpdateFolderModal,
    isCreateUpdateFolderModalVisible,
    onDeleteFile,
    menuItems,
    selectedFolder,
    onSubSidebarMenuItemClick,
    onSubSidebarOpenChange,
    breadcrumbItems,
    isDeleteModalVisible,
    hideDeleteModal,
    openFolderIds,
    fileLoading: files.isFetching,
    setSelectedFiles,
    selectedFiles,
    parentFolderId,
    isGridView,
    setIsGridView,
    inProgress,
    setInProgress,
    isAllFolderLoading: folders.isLoading,
    folderCount: folders.data?.length || 0,
    setCurrentFolderId,
    setPageNum,
    pageNum,
    isUploading,
    onSetUploadButtonUploading,
    mediaManagerPermission: permissions.canAccessMediaManager(),
    hasMedia:
      (folders.data !== undefined && folders.data.length > 1) || !isFilesEmpty,
    refreshFolderList,
    setFilesEmpty,
    onFileEdited,
    isFileEdited,
    updateFileEdited,
    isFileDetailsLoading: fileDetails.isLoading,
    isResetFilesFilter,
    updateResetFilesFilter
  };
};

export default useMediaManagerController;
