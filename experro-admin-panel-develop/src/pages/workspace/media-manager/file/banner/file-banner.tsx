import React from 'react';
import { Button, Col, Row, Upload } from 'antd';

import UploadNotification from '../upload-notification';
import useFileUpload from '../hooks/file-upload';
import FileUploadIcon from '../../../../../images/icons/file-upload-icon';
import MediaManagerBannerImage from '../../../../../images/icons/media-manager-banner-image';
import PlusIcon from '../../../../../images/icons/plus-icon';

const { Dragger } = Upload;

export interface FileBannerProps {
  workspaceId: string;
  setPageNum?: (pageNum: number) => void;
  folderId?: string;
  showDefaultBanner?: boolean;
  refetchData?: () => void;
  isPopup?: boolean;
  accept?: string;
  fileUploadSuccess?: () => void;
  isInProgress?: (inProgress: boolean) => void;
  isUploading: boolean;
  updateResetFilesFilter: (isReset: boolean) => void;
}

const FileBanner: React.FC<FileBannerProps> = ({
  workspaceId,
  setPageNum,
  folderId,
  showDefaultBanner,
  refetchData,
  isPopup,
  accept,
  fileUploadSuccess,
  isInProgress,
  isUploading,
  updateResetFilesFilter,
}) => {
  const {
    t,
    showProgressBar,
    uploadedFileCount,
    totalFileCount,
    uploadPercentage,
    uploadProps,
  } = useFileUpload(
    workspaceId,
    updateResetFilesFilter,
    setPageNum,
    folderId,
    refetchData,
    isPopup,
    accept,
    fileUploadSuccess
  );

  isInProgress && isInProgress(showProgressBar);
  return (
    <div className="media-upload-box">
      <div className="upload-bar">
        <UploadNotification
          showNotification={showProgressBar}
          uploadedFileCount={uploadedFileCount}
          totalFileCount={totalFileCount}
          uploadPercentage={uploadPercentage}
        />
      </div>
      <Dragger
        {...uploadProps}
        disabled={isUploading ? isUploading : showProgressBar}
        className={`${showDefaultBanner ? 'generate-box' : 'file-upload-box'} `}
        showUploadList={false}>
        {showDefaultBanner ? (
          <Row className="generate-box media-genrate-box ant-row ant-space-align-center p-32">
            <Col span={12}>
              <div className="generate-box-content p-l-32">
                <h1 className="h4 m-b-16 secondary-black">
                  {t('common.labels.start_adding_files')}
                </h1>
                <p className="m-b-32 gray-text">
                  {t('common.messages.media_banner_description')}
                </p>
                <div className="ant-row ant-space-align-center">
                  <div className="m-r-24">
                    <Button
                      type="primary"
                      disabled={showProgressBar}
                      icon={
                        <span className="anticon">
                          <PlusIcon />
                        </span>
                      }>
                      {t('common.labels.upload')}
                    </Button>
                  </div>
                  <p className="m-0 ant-upload-hint padding-0">
                    {t('common.labels.drag_and_drop')}
                  </p>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className="generate-box-img ant-row ant-row-end">
                <MediaManagerBannerImage />
              </div>
            </Col>
          </Row>
        ) : (
          <>
            <p className="ant-upload-drag-icon">
              <span className="anticon">
                <FileUploadIcon />
              </span>
            </p>
            <p className="ant-upload-text">
              {t('common.labels.start_adding_files')}
            </p>
            <p className="m-0 light-gray">
              {t('common.messages.drag_drop_message')}
              <span className="text-blue">
                {t('common.messages.upload_from_computer')}
              </span>
            </p>
            <p className="m-0 ant-upload-hint padding-0">
              {t('common.labels.max_file_size')}
            </p>
          </>
        )}
      </Dragger>
    </div>
  );
};
export default FileBanner;
