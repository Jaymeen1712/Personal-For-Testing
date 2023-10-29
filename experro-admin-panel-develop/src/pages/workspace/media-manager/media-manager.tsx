import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { useTranslation } from 'react-i18next';

import CreateUpdateFolderModal from './folder/create-update';
import DeleteFolderModal from './folder/delete';
import useMediaManagerController from './media-manager-controller';
import ListMedia from './list-media';
import EditFile from './file/edit';
import {
  IMAGE_EXTENSIONS,
  openNotificationWithIcon,
  SIDEBAR_KEYS,
  TEXT_EXTENSIONS,
} from '../../../utills';
import SubSideBar from '../../../components/sub-sidebar/sub-sidebar';
import HeaderMediaManager from './header-media-manager';
import { IFile } from '../../../types';

interface MMProps {
  isPopUp?: boolean;
  onInsert?: (selectedFiles?: IFile[], url?: string) => void;
  accept?: string;
  multiple?: boolean;
  onCancel?: () => void;
  showSubmenuIcon?: boolean;
  onMainSidebarActiveItem?: (val: string) => void;
}

const MediaManager: React.FC<MMProps> = ({
  isPopUp,
  onInsert,
  accept,
  multiple,
  onCancel,
  showSubmenuIcon,
  onMainSidebarActiveItem,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  // eslint-disable-next-line
  const [selectedFiles, setSelectedFiles] = useState<any>();
  const [filterFileType, setFilterFileType] = useState<string>('');
  const [acceptedFileExtension, setAcceptedFileExtension] = useState<string>();
  const { t } = useTranslation();
  const { files, mediaManagerPermission } = useMediaManagerController(
    isPopUp,
    onMainSidebarActiveItem
  );
  useEffect(() => {
    setFilterFileType(accept || '');
    switch (accept) {
      case 'image':
        setAcceptedFileExtension(
          IMAGE_EXTENSIONS.map((item) => `.${item}`).toString()
        );
        break;
      case 'documents':
        setAcceptedFileExtension(
          TEXT_EXTENSIONS.map((item) => `.${item}`).toString()
        );
        break;
      default:
        setAcceptedFileExtension(undefined);
        break;
    }
  }, [accept]);

  const filePublicUrl = files?.data?.find(
    (file) => file.id === selectedFiles?.id
  )?.publicUrl;

  useEffect(() => {
    if (!mediaManagerPermission) {
      openNotificationWithIcon(
        'error',
        t('common.messages.error_permission_denied_media_manager')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* we used one state isPopUp , when it's true then media manager will display
   in content library popup*/
  return (
    <>
      {isPopUp ? (
        <>
          <Modal
            open={isOpen}
            title={t('common.labels.media_import')}
            className="CustomModal CustomModal-media"
            onCancel={() => {
              setIsOpen(false);
              onCancel && onCancel();
            }}
            footer={[
              <div
                className={
                  mediaManagerPermission ? '' : 'table-section table-disable'
                }>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    onCancel && onCancel();
                  }}
                  key="cancel">
                  {t('common.labels.cancel')}
                </Button>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    onInsert && onInsert(selectedFiles, filePublicUrl);
                  }}
                  type="primary"
                  disabled={selectedFiles?.length === 0}
                  key="Save">
                  {t('common.labels.insert')}
                </Button>
              </div>,
            ]}>
            <div
              className={
                mediaManagerPermission ? '' : 'table-section table-disable'
              }>
              <DefaultMediaManager
                showSubmenuIcon={showSubmenuIcon}
                hideMenu={true}
                multiple={multiple}
                accept={acceptedFileExtension}
                filterFileType={filterFileType}
                onSelectedFileChange={(files) => {
                  setSelectedFiles(files);
                }}
              />
            </div>
          </Modal>
        </>
      ) : (
        <DefaultMediaManager filterFileType={filterFileType} />
      )}
    </>
  );
};
const DefaultMediaManager: React.FC<{
  hideMenu?: boolean;
  onSelectedFileChange?: (files?: IFile[]) => void;
  accept?: string;
  multiple?: boolean;
  filterFileType: string;
  showSubmenuIcon?: boolean;
}> = ({
  hideMenu,
  onSelectedFileChange,
  accept,
  filterFileType,
  multiple,
  showSubmenuIcon,
}) => {
  const {
    t,
    workspaceId,
    folderId,
    fileId,
    file,
    refetchFolderData,
    menuItems,
    onCreateClick,
    hideCreateUpdateFolderModal,
    isCreateUpdateFolderModalVisible,
    selectedFolder,
    onSubSidebarMenuItemClick,
    onSubSidebarOpenChange,
    breadcrumbItems,
    isDeleteModalVisible,
    hideDeleteModal,
    openFolderIds,
    parentFolderId,
    isGridView,
    setIsGridView,
    fileDownloadLink,
    setInProgress,
    setCurrentFolderId,
    inProgress,
    setPageNum,
    pageNum,
    isUploading,
    onSetUploadButtonUploading,
    hasMedia,
    refreshFolderList,
    setFilesEmpty,
    isFileEdited,
    onFileEdited,
    updateFileEdited,
    isFileDetailsLoading,
    isAllFolderLoading,
    isResetFilesFilter,
    updateResetFilesFilter
  } = useMediaManagerController(hideMenu);
  return (
    <>
      <div className="page-wrapper">
        <SubSideBar
          sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.MEDIA_MANAGER}
          subSidebarMenuItems={
            menuItems.length > 0
              ? menuItems
              : [
                  {
                    key: SIDEBAR_KEYS.WORKSPACE.MEDIA_MANAGER,
                    label: '',
                    icon: <></>,
                  },
                ]
          }
          onSubSidebarMenuItemClick={onSubSidebarMenuItemClick}
          onSubSidebarParentMenuItemClick={onSubSidebarOpenChange}
          subSidebarActiveItemKey={folderId}
          openSubSidebarMenuItems={openFolderIds}
          hideMenu={hideMenu}
          showSubmenuIcon={showSubmenuIcon}
          isEnvironmentSelectorVisible={true}
          isEnvironmentSelectorDisable={true}
          environmentSelectDefaultValue={'All'}
          disableEnvironmentToolTipMessage={t(
            'common.messages.environment_is_not_applicable'
          )}>
          <HeaderMediaManager
            hideMenu={hideMenu}
            breadcrumbItems={breadcrumbItems}
            fileId={fileId}
            fileDownloadLink={fileDownloadLink}
            t={t}
            hasMedia={hasMedia}
            onCreateClick={onCreateClick}
            inProgress={inProgress}
            workspaceId={workspaceId}
            folderId={folderId}
            refetchFolderData={refetchFolderData}
            accept={accept}
            setPageNum={setPageNum}
            updateResetFilesFilter={updateResetFilesFilter}
            onSetUploadButtonUploading={onSetUploadButtonUploading}
          />
          <ListMedia
            isResetFilesFilter={isResetFilesFilter}
            folderId={folderId}
            fileId={fileId}
            breadcrumbItems={breadcrumbItems.length}
            isAllFolderLoading={isAllFolderLoading}
            isGridView={isGridView}
            setIsGridView={(isGridView) => setIsGridView(isGridView)}
            refetchFolderData={refetchFolderData}
            filterFileType={filterFileType}
            setInProgress={(inProgress) => {
              setInProgress && setInProgress(inProgress);
            }}
            onSelectedFileChange={(selectedFiles) => {
              onSelectedFileChange && onSelectedFileChange(selectedFiles);
            }}
            updateFilesEmpty={setFilesEmpty}
            accept={accept}
            multiple={multiple}
            setCurrentFolderId={setCurrentFolderId}
            setPageNum={setPageNum}
            pageNum={pageNum}
            isPopUp={hideMenu}
            isUploading={isUploading}
            refreshFolderList={refreshFolderList}
            isFileEdited={isFileEdited}
            updateFileEdited={updateFileEdited}
            updateResetFilesFilter={updateResetFilesFilter}
          />

          {fileId && (
            <EditFile
              workspaceId={workspaceId}
              folderId={folderId}
              refetchFolderData={refetchFolderData}
              fileId={fileId}
              onFileEdited={onFileEdited}
              //@ts-ignore
              file={file}
              isFileDetailsLoading={isFileDetailsLoading}
            />
          )}
        </SubSideBar>
      </div>

      <DeleteFolderModal
        onDeleted={() => updateResetFilesFilter(true)}
        isDeleteModalVisible={isDeleteModalVisible}
        hideDeleteModal={hideDeleteModal}
        selectedFolder={selectedFolder}
        parentFolderId={parentFolderId}
        isPopUp={hideMenu}
        setCurrentFolderId={setCurrentFolderId}
      />

      {isCreateUpdateFolderModalVisible && (
        <CreateUpdateFolderModal
          hideCreateUpdateFolderModal={hideCreateUpdateFolderModal}
          isCreateUpdateFolderModalVisible={isCreateUpdateFolderModalVisible}
          selectedFolder={selectedFolder}
          breadcrumbItems={breadcrumbItems}
          folderId={folderId}
          isPopUp={hideMenu}
          setCurrentFolderId={setCurrentFolderId}
          folderDepth={breadcrumbItems.length}
        />
      )}
    </>
  );
};

export default MediaManager;
