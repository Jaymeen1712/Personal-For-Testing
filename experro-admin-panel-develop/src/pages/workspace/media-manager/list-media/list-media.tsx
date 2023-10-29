import React from 'react';
import { Button, Spin, Table, Tooltip } from 'antd';

import Filter from '../../../../components/filter';
import GridView from './grid-view';
import MoveFolderModal from '../file/move-folder';
import GridIcon from '../../../../images/icons/grid-icon';
import ListIcon from '../../../../images/icons/list-icon';
import DeleteIcon from '../../../../images/icons/delete-icon';
import FilterSelect from '../../../../components/filter-select';
import FileBanner from '../file/banner';
import DeleteFileModal from '../file/delete';
import useListMediaController from './list-media-controller';
import { IFile, RowRecord } from '../../../../types';
import NoDataFound from '../../../../components/no-data-found';
import { LoadingOutlined } from '@ant-design/icons';
import GridIconHover from '../../../../images/icons/grid-icon-active';
import ListIconHover from '../../../../images/icons/list-icon-hover';
import FolderborderIcon from '../../../../images/icons/folder-border-icon';
import NoRecordIcon from '../../../../images/icons/no-records-icon';

export interface ListMediaProps {
  isResetFilesFilter: boolean;
  folderId?: string;
  isGridView: boolean;
  isAllFolderLoading: boolean;
  setIsGridView: (isGridView: boolean) => void;
  setPageNum: (pageNum: number) => void;
  pageNum: number;
  setInProgress?: (inProgress: boolean) => void;
  breadcrumbItems?: number;
  onSelectedFileChange?: (selectedFile?: IFile[]) => void;
  fileId?: string | null;
  refetchFolderData: () => void;
  accept?: string;
  multiple?: boolean;
  setCurrentFolderId: (folderId: string) => void;
  isPopUp?: boolean;
  isUploading: boolean;
  refreshFolderList: () => void;
  updateFilesEmpty: (isEmpty: boolean) => void;
  filterFileType: string;
  isFileEdited: boolean;
  updateFileEdited: (isEdited: boolean) => void;
  updateResetFilesFilter: (isReset: boolean) => void;
}

const ListMedia: React.FC<ListMediaProps> = ({
  folderId,
  onSelectedFileChange,
  isResetFilesFilter,
  isGridView,
  setIsGridView,
  setPageNum,
  pageNum,
  setInProgress,
  breadcrumbItems,
  refetchFolderData,
  fileId,
  accept,
  multiple,
  setCurrentFolderId,
  isPopUp,
  isUploading,
  refreshFolderList,
  updateFilesEmpty,
  filterFileType,
  isFileEdited,
  updateFileEdited,
  updateResetFilesFilter,
}) => {
  const {
    t,
    filter,
    workspaceId,
    file,
    files,
    folders,
    selectedFiles,
    isMoveFolderModalVisible,
    isDeleteFileModalVisible,
    isAllFileSelected,
    isLoading,
    menuList,
    sortBy,
    sortingOptions,
    columns,
    mediaList,
    perPage,
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
    foldersData,
    searchFiles,
    searchFolder,
    mediaSearchList,
    search,
    isFilesAvailable,
    setSelectedFiles,
    isMoveFileLoading,
    isInitialContainLoading,
    fileTypeFilter,
    selectedFolderMediaCount,
    listViewMedias,
    fileTypeOption,
    isFoldersFilesLoadedOnce,
    onChangeFilter,
    onChangeSortBy,
    deleteFileConfirmationMessage,
  } = useListMediaController(
    isResetFilesFilter,
    isGridView,
    setIsGridView,
    setPageNum,
    pageNum,
    refreshFolderList,
    updateFilesEmpty,
    filterFileType,
    isFileEdited,
    updateFileEdited,
    setCurrentFolderId,
    updateResetFilesFilter,
    folderId,
    onSelectedFileChange,
    isPopUp,
    multiple
  );
  /* when click on load more button pageNum is increment and then
   *  we're multiplying perPage  with pageNum then record will be displayed according to condition */

  const updatePageNum = () => {
    setPageNum(pageNum + 1);
  };

  const noUserFolderAdded =
    !isFilesAvailable &&
    !(
      (foldersData?.length > 0 && breadcrumbItems !== 1) ||
      (foldersData?.length > 1 && breadcrumbItems === 1)
    );

  return (
    <>
      {
        <>
          {noUserFolderAdded ? (
            <>
              {!isLoading && !filter && (
                <FileBanner
                  updateResetFilesFilter={updateResetFilesFilter}
                  showDefaultBanner
                  workspaceId={workspaceId}
                  folderId={folderId}
                  refetchData={refetchFolderData}
                  isInProgress={(inProgress) => {
                    setInProgress && setInProgress(inProgress);
                  }}
                  accept={accept}
                  isUploading={isUploading}
                />
              )}
            </>
          ) : (
            !fileId && (
              <>
                {isFoldersFilesLoadedOnce &&
                  (foldersData?.length > 1 || isFilesAvailable) && (
                    <div className="search-section ant-row ant-row-space-between ant-space-align-center">
                      {selectedFiles?.length === 0 || !selectedFiles ? (
                        <>
                          <div className="media-search-left ant-row ant-space-align-center">
                            <Filter
                              onChange={setFilter}
                              minSearchableLength={1}
                              searchText={filter}
                            />
                            <div className="media-count m-l-16">
                              <span>
                                {selectedFolderMediaCount.folderCount} folder
                              </span>
                              <span>
                                {selectedFolderMediaCount.filesCount} media
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="ant-row ant-row-middle">
                          <p className="m-0 m-r-24 title-sm font-normal gray-text">{`${
                            selectedFiles?.length
                          } ${t('common.labels.selected')}`}</p>
                          {(typeof multiple === 'undefined' || multiple) && (
                            <Button
                              className=""
                              type="link"
                              onClick={onSelectAllFile}>
                              {t('common.labels.select_all')}
                            </Button>
                          )}
                          <Button type="link" onClick={onClearSelectedFile}>
                            {t('common.labels.clear')}
                          </Button>
                        </div>
                      )}
                      <div>
                        {selectedFiles?.length === 0 || !selectedFiles ? (
                          <>
                            <div className="media-view-button ant-row">
                              <div className="filters ant-space ant-space-horizontal ant-space-align-center m-r-24">
                                <div className="ant-space-item-main">
                                  <span className="filter-custom-dropdown-label">
                                    {t('common.labels.sort_by')}
                                  </span>
                                  <FilterSelect
                                    className="filter-custom-dropdown borderless-select"
                                    overlayClassName="dropdown-size-medium"
                                    type="select"
                                    options={sortingOptions}
                                    value={sortBy}
                                    onChange={onChangeSortBy}
                                  />
                                </div>
                                {!isPopUp && (
                                  <div className="ant-space-item-main">
                                    <span className="filter-custom-dropdown-label">
                                      {t('common.labels.filter_by')}
                                    </span>
                                    <FilterSelect
                                      className="filter-custom-dropdown borderless-select"
                                      overlayClassName="dropdown-size-medium"
                                      type="select"
                                      options={fileTypeOption}
                                      value={fileTypeFilter}
                                      onChange={onChangeFilter}
                                    />
                                  </div>
                                )}
                              </div>
                              <Tooltip
                                placement="bottom"
                                title={t('common.labels.grid_view')}>
                                <Button
                                  type="text"
                                  onClick={showGridView}
                                  icon={
                                    <span className="mediaviewbothicon">
                                      <GridIcon />
                                      <GridIconHover />
                                    </span>
                                  }
                                  className={isGridView ? 'active' : ''}
                                />
                              </Tooltip>
                              <Tooltip
                                placement="bottom"
                                title={t('common.labels.list_view')}>
                                <Button
                                  type="text"
                                  onClick={showListView}
                                  icon={
                                    <span className="mediaviewbothicon">
                                      <ListIcon />
                                      <ListIconHover />
                                    </span>
                                  }
                                  className={!isGridView ? 'active' : ''}
                                />
                              </Tooltip>
                            </div>
                          </>
                        ) : (
                          <div className="ant-row media-buttons">
                            {selectedFiles?.length === 1 &&
                              foldersData &&
                              foldersData.length > 1 && (
                                <Button
                                  icon={
                                    <span className="anticon">
                                      <FolderborderIcon />
                                    </span>
                                  }
                                  onClick={onMoveSelectedFile}>
                                  {t('common.labels.move')}
                                </Button>
                              )}
                            <Button
                              icon={
                                <span className="anticon">
                                  <DeleteIcon />
                                </span>
                              }
                              onClick={onDeleteSelectedFile}
                              danger>
                              {t('common.labels.delete')}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                {isInitialContainLoading ? (
                  <Spin
                    data-testid={'loader'}
                    className="HV-center table-center"
                    indicator={
                      <LoadingOutlined style={{ fontSize: 40 }} spin />
                    }
                    size="large"
                  />
                ) : (
                  <div>
                    {isGridView && (
                      <GridView
                        files={filter?.length > 0 ? searchFiles : files}
                        folders={filter?.length > 0 ? searchFolder : folders}
                        selectedFiles={selectedFiles}
                        onFolderClick={onFolderClick}
                        onFileSelectChange={onFileSelectChange}
                        onLinkCopy={onLinkCopy}
                        menuList={menuList}
                        onClickHover={onEditClick}
                        multiple={multiple}
                        isPopUp={isPopUp}
                        isLoading={isLoading}
                        search={search}
                        mediaSearchList={mediaSearchList}
                        updatePageNum={updatePageNum}
                        perPage={perPage}
                        filter={filter}
                      />
                    )}

                    {!isGridView && (
                      <>
                        <div className="table-section m-b-32 listview-table">
                          <Table
                            columns={columns}
                            dataSource={listViewMedias}
                            rowSelection={{
                              type: 'checkbox',
                              selectedRowKeys: selectedFiles?.map(
                                (item: IFile) => item.id
                              ),
                              onSelectAll: isAllFileSelected
                                ? onClearSelectedFile
                                : onSelectAllFile,
                              onSelect: onFileSelectChange,
                              getCheckboxProps: (record: object) => {
                                return {
                                  disabled: !(record as RowRecord).type,
                                  key: (record as RowRecord).id,
                                };
                              },
                              hideSelectAll:
                                typeof multiple !== 'undefined' && !multiple,
                            }}
                            locale={{ emptyText: <></> }}
                            pagination={false}
                            rowKey="id"
                          />
                        </div>

                        <div className="text-center load-more-button">
                          {filter?.length > 0 ? (
                            search?.fileCount &&
                            search?.fileCount > 0 &&
                            !search.isLoading &&
                            mediaSearchList?.length < search?.fileCount ? (
                              <Button
                                type="primary"
                                loading={search.isLoading}
                                onClick={() => updatePageNum()}>
                                {t('common.labels.load_more')}
                              </Button>
                            ) : (
                              !search.isLoading &&
                              Number(search?.fileCount) > perPage && (
                                <span>
                                  {t('common.labels.that_is_all_folks')}
                                </span>
                              )
                            )
                          ) : (
                            files &&
                            files?.length > 0 &&
                            files[0].totalFiles &&
                            (files?.length < files[0].totalFiles ? (
                              <Button
                                type="primary"
                                onClick={() => updatePageNum()}>
                                {t('common.labels.load_more')}
                              </Button>
                            ) : (
                              Number(files[0].totalFiles) > perPage &&
                              mediaList &&
                              !isGridView &&
                              !isLoading && (
                                <span>
                                  {t('common.labels.that_is_all_folks')}
                                </span>
                              )
                            ))
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {!isLoading &&
                  foldersData.length > 1 &&
                  !search?.isLoading &&
                  ((filter?.length === 0 &&
                    fileTypeFilter.length === 0 &&
                    files?.length === 0) ||
                    (filter?.length === 0 &&
                      searchFiles?.length === 0 &&
                      searchFolder?.length === 0)) && (
                    <FileBanner
                      showDefaultBanner={false}
                      workspaceId={workspaceId}
                      folderId={folderId}
                      refetchData={refetchData}
                      fileUploadSuccess={() => setPageNum(1)}
                      isInProgress={(inProgress) => {
                        setInProgress && setInProgress(inProgress);
                      }}
                      accept={accept}
                      isUploading={isUploading}
                      updateResetFilesFilter={updateResetFilesFilter}
                    />
                  )}

                {!search.isLoading &&
                  !isLoading &&
                  ((filter?.length > 0 && search?.files?.length === 0) ||
                    (fileTypeFilter.length > 0 && files?.length === 0)) && (
                    <NoDataFound
                      icon={<NoRecordIcon />}
                      title={t('common.messages.no_media_found')}
                    />
                  )}

                {isMoveFolderModalVisible && (
                  <MoveFolderModal
                    isModalVisible={isMoveFolderModalVisible}
                    folderId={folderId}
                    onMoveFile={onMoveFile}
                    hideModal={onHideMoveModal}
                    isMoveFileLoading={isMoveFileLoading}
                  />
                )}

                <DeleteFileModal
                  confirmationMessage={deleteFileConfirmationMessage}
                  workspaceId={workspaceId}
                  folderId={folderId}
                  isDeleteModalVisible={isDeleteFileModalVisible}
                  hideDeleteModal={onHideDeleteFileModal}
                  selectedFiles={file ? file : selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  refetchData={onDeleteFile}
                />
              </>
            )
          )}
        </>
      }
    </>
  );
};

export default ListMedia;
