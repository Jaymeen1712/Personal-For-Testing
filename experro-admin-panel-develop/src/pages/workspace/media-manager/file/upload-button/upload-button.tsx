import React from 'react';
import { Button, Upload } from 'antd';

import UploadNotification from '../upload-notification';
import useFileUpload from '../hooks/file-upload';
import PlusIcon from '../../../../../images/icons/plus-icon';

interface UploadButtonProps {
  workspaceId: string;
  folderId: string;
  refetchFolderData: () => void;
  updateResetFilesFilter: (isReset: boolean) => void,
  disabled?: boolean;
  isPopup?: boolean;
  accept?: string;
  setPageNum?: (pageNum: number) => void;
  onSetUploadButtonUploading: (isUploading: boolean) => void;
}

const UploadButton: React.FC<UploadButtonProps> = (props) => {
  const {
    workspaceId,
    setPageNum,
    folderId,
    refetchFolderData,
    updateResetFilesFilter,
    isPopup,
    accept,
    onSetUploadButtonUploading,
  } = props;
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
    refetchFolderData,
    isPopup,
    accept
  );

  onSetUploadButtonUploading(showProgressBar);

  return (
    <>
      <div className="upload-bar">
        <UploadNotification
          showNotification={showProgressBar}
          uploadedFileCount={uploadedFileCount}
          totalFileCount={totalFileCount}
          uploadPercentage={uploadPercentage}
        />
      </div>
      <Upload {...uploadProps} className="ant-row">
        <Button
          htmlType="button"
          disabled={showProgressBar}
          type="primary"
          icon={<span className="anticon"><PlusIcon /></span>}
          {...props}>
          {t('common.labels.upload')}
        </Button>
      </Upload>
    </>
  );
};

export default UploadButton;
