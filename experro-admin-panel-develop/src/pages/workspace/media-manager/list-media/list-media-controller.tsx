import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  APIS_ROUTES,
  convertAndFormatDate,
  formatFileSize,
  openNotificationWithIcon,
} from '../../../../utills';
import {
  GridParams,
  IFile,
  IFolder,
  IGlobalSearch,
  IMedia,
  ISearchFiles,
  ISubFolder,
  IWorkspaceParams,
} from '../../../../types';
import useError from '../../../../hooks/error';
import MediaCellRenderer from './media-cell-renderer';
import useUser from '../../../../hooks/user';
import useGlobalSearchFolders from '../services/folder/global-search';
import useGlobalSearchFiles from '../services/file/global-search';
import {
  useListFile,
  useListFolder,
  useListSubFolder,
  useMoveFile,
} from '../services';
import { useListAllUser } from '../services/user';

const useListMediaController = (
  isResetFilesFilter: boolean,
  isGridView: boolean,
  setIsGridView: (isGridView: boolean) => void,
  setPageNum: (pageNum: number) => void,
  pageNum: number,
  refreshFolderList: () => void,
  updateFilesEmpty: (isEmpty: boolean) => void,
  filterFileType: string,
  isFileEdited: boolean,
  updateFileEdited: (isEdited: boolean) => void,
  setCurrentFolderId: (folderId: string) => void,
  updateResetFilesFilter: (isReset: boolean) => void,
  folderId?: string,
  onSelectedFileChange?: (selectedFiles?: IFile[]) => void,
  isPopUp?: boolean,
  multiple?: boolean,
) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const history = useHistory();
  const user = useUser();
  const folders = useListFolder(workspaceId);

  const [sortBy, setSortBy] = useState('recent_update');
  const [isMoveFolderModalVisible, setIsMoveFolderModalVisible] =
    useState(false);
  const [isDeleteFileModalVisible, setIsDeleteFileModalVisible] =
    useState(false);
  const [file, setFile] = useState<string[]>();
  const [selectedFiles, setSelectedFiles] = useState<IFile[] | undefined>();
  const [fileId, setFileId] = useState<string>();
  const [fileTypeFilter, setFileTypeFilter] = useState('');
  const [moveFolderId, setMoveFolderId] = useState<string>();
  const [filter, setFilter] = useState('');
  const [perPage] = useState<number>(12);
  const foldersData = folders?.data || [];
  const location = useLocation();
  const [isFilesAvailable, setFilesAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditClick, setIsEditClick] = useState(false);
  const [subFolder, setSubFolder] = useState<ISubFolder[]>([]);
  const [searchFiles, setSearchFiles] = useState<ISearchFiles[]>([]);
  // eslint-disable-next-line
  const [listViewMedias, setListViewMedias] = useState<any[]>([]);
  const users = useListAllUser();
  const [isFoldersFilesLoadedOnce, setFoldersFilesLoadedOnce] = useState(false);
  const [deleteFileConfirmationMessage, setDeleteFileConfirmationMessage] =
    useState('');

  const params = useMemo(() => {
    const params: GridParams = {};

    if (filter) {
      params.search = filter;
    }

    if (sortBy === 'oldest_update') {
      params.orderBy = 'asc';
      params.sortBy = 'modified_at';
    } else if (sortBy === 'recent_update') {
      params.orderBy = 'desc';
      params.sortBy = 'modified_at';
    } else if (sortBy === 'a_to_z') {
      params.orderBy = 'asc';
      params.sortBy = 'name';
    } else if (sortBy === 'z_to_a') {
      params.orderBy = 'desc';
      params.sortBy = 'name';
    }

    params.fields = '*';
    params.limit = (perPage * pageNum).toString();

    return params;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, sortBy, pageNum]);

  const { data: globalSearchFolders, isLoading: isGlobalSearchLoading } =
    useGlobalSearchFolders(
      workspaceId,
      filter,
      perPage * pageNum,
      fileTypeFilter,
      folderId,
      params
    );
  const {
    data: globalSearchFiles,
    isLoading: isGlobalFilesLoading,
    isSuccess: isSuccessGlobalSearchFiles,
    refetch: globalSearchFilesRefetch,
  } = useGlobalSearchFiles(
    workspaceId,
    filter,
    perPage * pageNum,
    fileTypeFilter,
    isPopUp,
    folderId,
    params
  );

  const search: IGlobalSearch = {
    isLoading: isGlobalSearchLoading || isGlobalFilesLoading,
    files: globalSearchFiles?.items?.files || [],
    folders: globalSearchFolders?.items?.folders || [],
    fileCount: globalSearchFiles?.items?.fileCount || 0,
  };

  const mediaSearchFileObject = useMemo(() => {
    return [
      ...(globalSearchFiles?.items?.files || []).map((files: ISearchFiles) => {
        const owner = users.data?.find((user) => user.id === files.createdBy);
        const sizeWithType = formatFileSize(files.size);
        return owner
          ? {
              ...files,
              owner: `${owner.firstName} ${owner.lastName}`,
              sizeWithType: sizeWithType,
            }
          : { ...files };
      }),
    ];
  }, [globalSearchFiles?.items?.files, users.data]);

  const mediaSearchFolderObject = useMemo(() => {
    return [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(globalSearchFolders?.items?.folders || []).map((search: any) => {
        const owner = users.data?.find((user) => user.id === search.createdBy);
        return owner
          ? {
              ...search,
              owner: `${owner.firstName} ${owner.lastName}`,
            }
          : { ...search };
      }),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalSearchFolders?.items?.folders, users.data]);

  const mediaSearchList: IFolder[] = useMemo(() => {
    if (mediaSearchFolderObject && mediaSearchFileObject) {
      return [...mediaSearchFolderObject, ...mediaSearchFileObject];
    } else if (mediaSearchFolderObject) {
      return mediaSearchFolderObject;
    } else if (mediaSearchFileObject) {
      return mediaSearchFileObject;
    } else {
      return [];
    }
  }, [mediaSearchFolderObject, mediaSearchFileObject]);

  // const searchFiles = globalSearchFiles?.items?.files;
  const searchFolder = globalSearchFolders?.items?.folders;

  useEffect(() => {
    if (globalSearchFiles?.items?.files) {
      setSearchFiles(globalSearchFiles.items.files);
    }
  }, [globalSearchFiles?.items?.files]);

  useEffect(() => {
    if (filterFileType !== fileTypeFilter) {
      setFileTypeFilter(filterFileType);
    }
    // eslint-disable-next-line
  }, [filterFileType]);

  useEffect(() => {
    onSelectedFileChange && onSelectedFileChange(selectedFiles);
  }, [selectedFiles, onSelectedFileChange]);

  useEffect(() => {
    setPageNum && setPageNum(1);
    if (filter?.length > 0) {
      setFilter('');
    }
    setIsEditClick(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const onChangeSortBy = (sort: string) => {
    setSortBy(sort);
  };

  const onChangeFilter = (filter: string) => {
    setFileTypeFilter(filter);
  };

  const fileTypeOption = useMemo(
    () => [
      {
        key: '',
        className: fileTypeFilter === '' ? 'activeDropdown' : '',
        label: 'All',
      },
      {
        key: 'image',
        className: fileTypeFilter === 'image' ? 'activeDropdown' : '',
        label: 'Image',
      },
      // {
      //   key: 'audio',
      //   className: fileTypeFilter === 'audio' ? 'activeDropdown' : '',
      //   label: 'Audio',
      // },
      {
        key: 'documents',
        className: fileTypeFilter === 'documents' ? 'activeDropdown' : '',
        label: 'Documents',
      },
      // {
      //   key: 'video',
      //   className: fileTypeFilter === 'video' ? 'activeDropdown' : '',
      //   label: 'Video',
      // },
    ],
    [fileTypeFilter]
  );

  const sortingOptions = useMemo(
    () => [
      {
        key: 'recent_update',
        className: sortBy === 'recent_update' ? 'activeDropdown' : '',
        label: t('common.labels.recently_update'),
      },
      {
        key: 'oldest_update',
        className: sortBy === 'oldest_update' ? 'activeDropdown' : '',
        label: t('common.labels.oldest_update'),
      },
      {
        key: 'a_to_z',
        className: sortBy === 'a_to_z' ? 'activeDropdown' : '',
        label: t('common.labels.a_to_z'),
      },
      {
        key: 'z_to_a',
        className: sortBy === 'z_to_a' ? 'activeDropdown' : '',
        label: t('common.labels.z_to_a'),
      },
    ],
    [t, sortBy]
  );

  useEffect(() => {
    if (pageNum > 1 && filter?.length > 0) {
      globalSearchFilesRefetch();
    } else {
      files.refetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum]);

  const subFolders = useListSubFolder(
    workspaceId,
    fileTypeFilter,
    folderId,
    params
  );
  const files = useListFile(
    workspaceId,
    fileTypeFilter,
    folderId,
    isPopUp,
    params
  );
  const moveFile = useMoveFile(workspaceId, moveFolderId);

  useError({
    mutation: moveFile,
    entity: t('common.labels.search_folder'),
  });

  useEffect(() => {
    if (isFileEdited) {
      files.refetch();
    }
    // eslint-disable-next-line
  }, [isFileEdited]);

  useEffect(() => {
    if (files.isSuccess && files.data) {
      updateFileEdited(false);
    }
    // eslint-disable-next-line
  }, [files.data, files.isSuccess]);

  useEffect(() => {
    if (!isPopUp && isResetFilesFilter) {
      setFileTypeFilter('');
      updateResetFilesFilter(false);
    }
  }, [isResetFilesFilter, isPopUp, updateResetFilesFilter]);

  /* we have to show all files and sub-folders data by particluar folder and user so ,
  we get that data by mapping with folder and files apis. */

  const mediaList = useMemo(() => {
    return [
      ...(subFolders.data || []).map((folder) => {
        const owner = users.data?.find((user) => user.id === folder.createdBy);
        return owner
          ? { ...folder, owner: `${owner.firstName} ${owner.lastName}` }
          : { ...folder };
      }),
      ...(files.data || []).map((file) => {
        const owner = users.data?.find((user) => user.id === file.createdBy);
        return owner
          ? { ...file, owner: `${owner.firstName} ${owner.lastName}` }
          : { ...file };
      }),
    ];
  }, [files.data, subFolders.data, users.data]);

  const refetchData = useCallback(() => {
    files.refetch();
    subFolders.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFolderClick = useCallback(
    (folderId: string) => {
      if (isPopUp) {
        setPageNum(1);
        setCurrentFolderId && setCurrentFolderId(folderId);
      } else {
        history.push(
          `/workspaces/${workspaceId}/media-manager?folder=${folderId}`
        );
      }
    },
    // eslint-disable-next-line
    [history, workspaceId, isPopUp, setCurrentFolderId]
  );

  const onFileSelectChange = useCallback(
    (fileObject: object) => {
      const file = fileObject as IFile;
      if (
        selectedFiles?.findIndex(
          (selectedFile: IFile) => selectedFile.id === file.id
        ) === -1
      ) {
        if (multiple === undefined || multiple) {
          setSelectedFiles([...selectedFiles, file]);
        } else {
          setSelectedFiles([file]);
        }
      } else {
        setSelectedFiles(
          selectedFiles?.filter(
            (selectedFile: IFile) => selectedFile.id !== file.id
          )
        );
      }
    },
    // eslint-disable-next-line
    [selectedFiles]
  );

  const onLinkCopy = useCallback(
    () =>
      openNotificationWithIcon('success', t('common.messages.linked_copied')),
    [t]
  );

  const onEditClick = useCallback(
    (fileId: string) => {
      if (fileId) {
        setIsEditClick(true);
        setFileId(fileId);
        history.push(
          `/workspaces/${workspaceId}/media-manager?folder=${folderId}&file=${fileId}`
        );
      } else {
        setIsEditClick(false);
      }
    },
    [folderId, history, workspaceId]
  );

  const onDeleteFileClick = (fileId: string) => {
    let file;
    if (filter.length) {
      file = globalSearchFiles?.items?.files?.find(
        (file) => file.id === fileId
      );
    } else {
      file = files.data?.find((file) => file.id === fileId);
    }
    if (file) {
      setFile([file.id]);
      setDeleteFileConfirmationMessage(
        t('common.messages.delete_particular_file_message')
      );
      setIsDeleteFileModalVisible(true);
    }
  };

  useEffect(() => {
    setIsLoading(
      files.isFetching || subFolders.isFetching || folders.isFetching
    );
    if (!files.isFetching) {
      setFilesAvailable(
        (files.data && files.data.length > 0) || fileTypeFilter.length > 0
      );
      updateFilesEmpty(
        !(files.data && files.data.length > 0) && fileTypeFilter.length === 0
      );
    }
  }, [files, folders, subFolders, updateFilesEmpty, fileTypeFilter, isPopUp]);

  useEffect(() => {
    if (
      isSuccessGlobalSearchFiles &&
      filter.length &&
      globalSearchFiles?.items.files
    ) {
      const moveFolderId = globalSearchFiles?.items.files.find(
        (file) => file.id === fileId
      )?.folderId;
      setMoveFolderId(moveFolderId);
    } else {
      setMoveFolderId(folderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMoveFolderModalVisible]);

  useEffect(() => {
    if (!isFoldersFilesLoadedOnce) {
      setFoldersFilesLoadedOnce(!folders.isLoading && !files.isFetching);
    }
  }, [folders.isLoading, files.isFetching, isFoldersFilesLoadedOnce]);

  const onHideDeleteFileModal = useCallback(() => {
    setIsDeleteFileModalVisible(false);
    setSelectedFiles([]);
  }, []);

  const onMoveFileClick = useCallback(
    (fileId: string) => {
      if (folders?.data?.length === 1) {
        openNotificationWithIcon('error', t('common.messages.no_folder_found'));
      } else if (selectedFiles && selectedFiles.length > 1) {
        openNotificationWithIcon(
          'error',
          t('common.messages.select_only_one_file')
        );
      } else {
        setFileId(fileId);
        setIsMoveFolderModalVisible(true);
      }
    },
    [folders, t, selectedFiles]
  );

  const onHideMoveModal = useCallback(() => {
    setIsMoveFolderModalVisible(false);
  }, []);

  const onMoveFile = useCallback(
    (targetFolderId?: string) => {
      if (fileId && targetFolderId) {
        moveFile.mutate({
          fileId,
          targetFolderId,
        });
      } else {
        openNotificationWithIcon('error', t('common.messages.select_folder'));
      }
    },
    [t, fileId, moveFile]
  );

  const onFileDownloadClick = useCallback(
    (fileId: string) => {
      let file;
      if (filter.length) {
        file = globalSearchFiles?.items?.files?.find(
          (file) => file.id === fileId
        );
      } else {
        file = files.data?.find((file) => file.id === fileId);
      }
      if (file) {
        return `${process.env.REACT_APP_API_URL}${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/files/${fileId}/download?extension=${file?.type}&name=${file?.name}`;
      }
    },
    // eslint-disable-next-line
    [file, fileId, workspaceId, files.data, globalSearchFiles]
  );

  const onSelectAllFile = useCallback(() => {
    if (filter?.length > 0) {
      if (mediaSearchList) {
        setSelectedFiles(mediaSearchList?.map((file) => file));
      }
    } else {
      if (files.data) {
        setSelectedFiles(files.data.map((file) => file));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.data, mediaSearchList]);

  const onClearSelectedFile = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  const onMoveSelectedFile = useCallback(() => {
    if (selectedFiles?.length === 1) {
      setFileId(selectedFiles[0].id);
      setIsMoveFolderModalVisible(true);
    }
  }, [selectedFiles]);

  const onDeleteSelectedFile = useCallback(() => {
    if (selectedFiles) {
      setDeleteFileConfirmationMessage(
        t('common.messages.delete_selected_file_message')
      );
      setIsDeleteFileModalVisible(true);
    }
    // eslint-disable-next-line
  }, [selectedFiles]);

  const onDeleteFilesSetPageNum = useCallback(() => {
    if (files?.data?.length === selectedFiles?.length) {
      setPageNum(1);
    }
    // eslint-disable-next-line
  }, [selectedFiles, files?.data]);

  const onDeleteFile = useCallback(() => {
    onDeleteFilesSetPageNum();
    refetchData();
    refreshFolderList();
    // eslint-disable-next-line
  }, [refetchData, onDeleteFilesSetPageNum]);

  const showGridView = useCallback(() => {
    setIsGridView(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showListView = useCallback(() => {
    setIsGridView(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuList = useMemo(
    () => [
      {
        key: 'edit',
        onClick: onEditClick,
        label: t('common.labels.edit'),
      },
      {
        key: 'move',
        onClick: onMoveFileClick,
        label: t('common.labels.move_folder'),
      },
      {
        key: 'download',
        onHref: onFileDownloadClick,
        label: t('common.labels.download'),
      },
      {
        key: 'delete',
        onClick: onDeleteFileClick,
        label: <span className="text-red">{t('common.labels.delete')}</span>,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onEditClick, onMoveFileClick, onDeleteFileClick]
  );

  const columns = useMemo(() => {
    return [
      {
        title: t('common.labels.name'),
        dataIndex: 'name',
        key: 'name',
        width: '35%',
        render: (name: string, row: object) => {
          return (
            <MediaCellRenderer
              media={row as IMedia}
              menuList={isPopUp ? [] : menuList}
              onLinkCopy={onLinkCopy}
              onFolderClick={onFolderClick}
              selectedFiles={selectedFiles}
              multiple={multiple}
              onFileSelectChange={onFileSelectChange}
              onFileClick={onEditClick}
              isPopUp={isPopUp}
            />
          );
        },
      },
      {
        title: t('common.labels.owner'),
        dataIndex: 'owner',
        key: 'owner',
        width: '15%',
      },
      {
        title: t('common.labels.size'),
        dataIndex: 'size',
        key: 'size',
        width: '15%',
        render: (size: number) => {
          return size ? formatFileSize(size) : '-';
        },
      },
      {
        title: t('common.labels.type'),
        dataIndex: 'type',
        key: 'type',
        width: '15%',
        render: (type: string) => (
          <>
            <div className={` ${type ? 'file-type' : ''}`}>
              {type ? `.${type}` : t('common.labels.directory')}
            </div>
          </>
        ),
      },
      {
        title: t('common.labels.modified_at'),
        dataIndex: 'modifiedAt',
        key: 'modified_at',
        width: '15%',
        render: (record: string) => {
          if (record) {
            return convertAndFormatDate(
              record,
              user?.user?.timezone,
              'D MMM YYYY'
            );
          } else {
            return '-';
          }
        },
      },
    ];
  }, [
    t,
    menuList,
    onLinkCopy,
    onFolderClick,
    onEditClick,
    isPopUp,
    multiple,
    onFileSelectChange,
    selectedFiles,
    user?.user?.timezone,
  ]);

  useError({
    mutation: moveFile,
    entity: t('common.labels.file'),
    cb: () => {
      onHideMoveModal();
      onClearSelectedFile();
    },
  });

  useEffect(() => {
    if (moveFile.isSuccess) {
      onHideMoveModal();
      onClearSelectedFile();

      refetchData();
      openNotificationWithIcon(
        'success',
        t('common.messages.entity_moved_successfully', {
          entity: t('common.labels.media'),
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveFile.isSuccess, t]);

  useEffect(() => {
    if (folderId) {
      setSelectedFiles([]);
    }
  }, [folderId]);

  useEffect(() => {
    if (!subFolders.isFetching) {
      setSubFolder(subFolders.data || []);
    }
  }, [subFolders.data, subFolders.isFetching]);

  useEffect(() => {
    setFilter('');
  }, [files.isFetching, folderId]);

  useEffect(() => {
    if (filter?.length > 0) {
      globalSearchFiles?.items?.files?.map((file) => {
        if (file.id === fileId && file.folderId !== folderId) {
          if (isEditClick) {
            history.push(
              `/workspaces/${workspaceId}/media-manager?folder=${file.folderId}&file=${file.id}`
            );
          }
        }
        return true;
      });
    }
  }, [
    globalSearchFiles?.items?.files,
    history,
    workspaceId,
    folderId,
    fileId,
    filter,
    isEditClick,
  ]);

  const selectedFolderMediaCount = useMemo(() => {
    return {
      folderCount:
        (filter.length > 0
          ? globalSearchFolders?.items.folders.length
          : subFolders.data?.length) || 0,
      filesCount:
        (filter.length > 0
          ? globalSearchFiles?.items.fileCount
          : files.data && files.data.length > 0
          ? files.data[0].totalFiles
          : 0) || 0,
    };
  }, [
    globalSearchFolders,
    subFolders.data,
    globalSearchFiles,
    files.data,
    filter,
  ]);

  useEffect(() => {
    if (filter.length > 0) {
      if (globalSearchFiles?.items?.files) {
        setListViewMedias(mediaSearchList.filter((item) => !isPopUp || isGridView || !!item.type));
      } else if (pageNum === 1) {
        setListViewMedias([]);
      }
    } else {
      setListViewMedias(
        mediaList.filter((item) => !isPopUp || isGridView || !!item.type)
      );
    }
  }, [
    globalSearchFiles,
    mediaSearchList,
    mediaList,
    filter,
    isPopUp,
    isGridView,
    pageNum,
  ]);

  const onFolderDelete = () => {
    if (!isPopUp) {
      setFileTypeFilter('');
    }
  };

  return {
    t,
    filter,
    fileId,
    workspaceId,
    file,
    files: files.data,
    folders: subFolder,
    selectedFiles,
    isGridView,
    isMoveFolderModalVisible,
    isDeleteFileModalVisible,
    isAllFileSelected: selectedFiles?.length === files.data?.length,
    isLoading,
    menuList,
    sortBy,
    sortingOptions,
    mediaList,
    columns,
    refetchData,
    onFolderClick,
    onFileSelectChange,
    onLinkCopy,
    onEditClick,
    onHideDeleteFileModal,
    onHideMoveModal,
    onDeleteFile,
    onMoveFile,
    onSelectAllFile,
    onClearSelectedFile,
    onMoveSelectedFile,
    onDeleteSelectedFile,
    showGridView,
    showListView,
    setFilter,
    setSortBy,
    perPage,
    foldersData,
    search,
    searchFiles,
    searchFolder,
    mediaSearchList,
    isGlobalSearchLoading,
    isGlobalFilesLoading,
    isFilesAvailable,
    setSelectedFiles,
    isInitialContainLoading:
      (folders.isFetching || subFolders.isFetching || files.isFetching) &&
      pageNum === 1,
    isMoveFileLoading: moveFile.isLoading,
    isLoadMoreLoading: pageNum > 1 && files.isFetching && isGlobalFilesLoading,
    fileTypeFilter,
    setFileTypeFilter,
    selectedFolderMediaCount,
    listViewMedias,
    onChangeSortBy,
    fileTypeOption,
    onChangeFilter,
    isFoldersFilesLoadedOnce,
    deleteFileConfirmationMessage,
    onFolderDelete,
  };
};

export default useListMediaController;
