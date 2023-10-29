import React from 'react';
import { Progress } from 'antd';
import { useTranslation } from 'react-i18next';

import CloudUploadIcon from '../../../../../images/icons/cloud-upload-icon';

interface UploadNotificationProps {
  showNotification: boolean;
  uploadedFileCount: number;
  totalFileCount: number;
  uploadPercentage: number;
}

const UploadNotification: React.FC<UploadNotificationProps> = ({
  showNotification,
  uploadedFileCount,
  totalFileCount,
  uploadPercentage,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`upload-bar-inner ${showNotification ? '' : 'display-none'}`}>
      <div className="ant-row ant-row-space-between">
        <p>
          <CloudUploadIcon />
          {t('common.labels.uploading')}
        </p>
        <span>{`${uploadedFileCount}/${totalFileCount}`}</span>
      </div>
      <Progress percent={uploadPercentage} showInfo={false} />
    </div>
  );
};
export default UploadNotification;
