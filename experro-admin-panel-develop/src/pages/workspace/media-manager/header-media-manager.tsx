import React from 'react';
import { TFunction } from 'react-i18next';
import { Button } from 'antd';

import { onSidebarToggle } from '../../../utills';
import HamburgerIcon from '../../../images/icons/hamburger-icon';
import FolderBreadcrumb from './folder-breadcrumb';
import UploadButton from './file/upload-button';
import { IFolderBreadcrumb } from '../../../types';
import MediaDownloadIcon from '../../../images/icons/media-download-icon';

interface IHeaderMediaManager {
  hideMenu?: boolean;
  breadcrumbItems: IFolderBreadcrumb[];
  fileId: string | null;
  fileDownloadLink: string;
  t: TFunction<'translation'>;
  // eslint-disable-next-line
  onCreateClick: (event: any) => void;
  inProgress: boolean;
  hasMedia: boolean;
  workspaceId: string;
  folderId: string;
  refetchFolderData: () => void;
  accept?: string;
  setPageNum: (pageNum: number) => void;
  onSetUploadButtonUploading: (isUploading: boolean) => void;
  updateResetFilesFilter: (isReset: boolean) => void,
}

const HeaderMediaManager: React.FC<IHeaderMediaManager> = ({
  hideMenu,
  breadcrumbItems,
  fileId,
  fileDownloadLink,
  t,
  onCreateClick,
  inProgress,
  hasMedia,
  workspaceId,
  folderId,
  refetchFolderData,
  accept,
  setPageNum,
  onSetUploadButtonUploading,
  updateResetFilesFilter,
}) => {
  return (
    <div className="headerinner ant-row ant-space-align-start ant-row-space-between media-manager-header">
      <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
        <div className="hamburgericon" onClick={onSidebarToggle}>
          <HamburgerIcon />
        </div>
        <div className="w-100 ant-row ant-space-vertical">
          <span className="ant-page-header-heading-title">
            {hideMenu ? (
              <></>
            ) : (
              <FolderBreadcrumb folders={breadcrumbItems} isNavigation={true} />
            )}
          </span>
        </div>
      </div>
      <div className="headerright">
        <div className="ant-row ant-row-end ant-space-align-center">
          {fileId ? (
            <>
              <Button
                href={fileDownloadLink}
                target="_self"
                htmlType="button"
                icon={
                  <span className="anticon">
                    <MediaDownloadIcon />
                  </span>
                }>
                {t('common.labels.download')}
              </Button>
            </>
          ) : (
            <Button htmlType="button" onClick={onCreateClick}>
              {t('common.labels.create_folder')}
            </Button>
          )}
          {!fileId && breadcrumbItems.length > 0 && hasMedia && (
            <>
              {inProgress ? (
                <UploadButton
                  workspaceId={workspaceId}
                  folderId={folderId}
                  refetchFolderData={refetchFolderData}
                  isPopup={hideMenu}
                  accept={accept}
                  disabled={inProgress}
                  updateResetFilesFilter={updateResetFilesFilter}
                  onSetUploadButtonUploading={onSetUploadButtonUploading}
                />
              ) : (
                <UploadButton
                  workspaceId={workspaceId}
                  folderId={folderId}
                  refetchFolderData={refetchFolderData}
                  isPopup={hideMenu}
                  accept={accept}
                  setPageNum={setPageNum}
                  updateResetFilesFilter={updateResetFilesFilter}
                  onSetUploadButtonUploading={onSetUploadButtonUploading}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderMediaManager;
