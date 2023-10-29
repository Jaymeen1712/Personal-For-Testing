import { useCallback, useEffect, useState } from 'react';
import { UploadProps } from 'antd';
import { useTranslation } from 'react-i18next';

import {
  APIS_ROUTES,
  openNotificationWithIcon,
  USER_ACCESS_KEY,
} from '../../../../../../utills';
import Cookies from 'js-cookie';

const useFileUpload = (
  workspaceId: string,
  updateResetFilesFilter: (isReset: boolean) => void,
  setPageNum?: (pageNum: number) => void,
  folderId?: string,
  refetchData?: () => void,
  isPopup?: boolean,
  accept?: string,
  fileUploadSuccess?: () => void,
  multiple?: boolean
) => {
  const { t } = useTranslation();
  const [uploadedFileCount, setUploadedFileCount] = useState(0);
  const [totalFileCount, setTotalFileCount] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [fileSizeExceededFailedCount, setFileSizeExceededFailedCount] =
    useState(0);
  const [isUploadingComplete, setIsUploadingComplete] = useState(false);
  const uploadInProgress = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = 'File will not upload';
  }, []);

  useEffect(() => {
    const percentage = (uploadedFileCount * 100) / totalFileCount;
    setUploadPercentage(percentage);
  }, [uploadedFileCount, totalFileCount, uploadInProgress]);

  useEffect(() => {
    if (totalFileCount > 0) {
      window.addEventListener('beforeunload', uploadInProgress);
    }
  }, [totalFileCount, uploadInProgress]);

  useEffect(() => {
    if (
      totalFileCount &&
      totalFileCount ===
        successCount + failedCount + fileSizeExceededFailedCount
    ) {
      if (successCount) {
        setIsUploadingComplete(true);
        openNotificationWithIcon(
          'success',
          t('common.messages.entity_uploaded_successfully', {
            entity: t('common.labels.media'),
          })
        );
      }
      if (failedCount) {
        setIsUploadingComplete(true);
        openNotificationWithIcon(
          'warning',
          t('common.messages.media_not_supported', {
            count: failedCount,
          })
        );
      }
      if (fileSizeExceededFailedCount) {
        setIsUploadingComplete(true);
        openNotificationWithIcon(
          'error',
          t('common.messages.media_size_exceeded_error_message', {
            count: fileSizeExceededFailedCount,
          })
        );
      }
    }
  }, [
    t,
    totalFileCount,
    successCount,
    failedCount,
    fileSizeExceededFailedCount,
  ]);

  useEffect(() => {
    if (
      isUploadingComplete &&
      totalFileCount &&
      totalFileCount ===
        successCount + failedCount + fileSizeExceededFailedCount
    ) {
      setSuccessCount(0);
      setFailedCount(0);
      setFileSizeExceededFailedCount(0);
    }
  }, [
    isUploadingComplete,
    totalFileCount,
    successCount,
    failedCount,
    fileSizeExceededFailedCount,
  ]);

  /* upload props object will be called when user upload any file .
   * here , we define all the accepted file formats in media manager as well as content library popup
   * and get totalFileCount and uploadFileCount which is used in upload notification component. */

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: typeof multiple !== 'undefined' ? multiple : true,
    accept:
      accept ||
      '.JPG,.JPEG,.GIF,.TIFF,.PSD,.PNG,.SVG,.AI,.BMP,.WEBP,.RAW,.M4A,.FLAC,.MP3,.MP4,.WAV,.WMA,.AAC,.OGG,.PCM,.MOV,.AVI,.FLV,.MKV,.WMV,.WEBM,.H264,.MPEG,.3GP,.DOC,.DOCX,.DOCM,.ODT,.WPD,.XLS,.XLSX,.XLSM,.CSV,.ODS,.PPT,.PPTX,.PPTM,.KEY,.ODP,.PPM,.ZIP,.RAR,.TAR,.BZ,.7Z,.GZ,.BZ2,.TXT,.RTF',
    showUploadList: false,
    action: `${process.env.REACT_APP_API_URL}${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/folders/${folderId}/files`,
    headers: {
      accessToken: `Bearer ${Cookies.get(USER_ACCESS_KEY.TOKEN)}`,
    },
    beforeUpload: (file) => {
      const splitName = file.name.split('.');
      if (splitName.length > 0) {
        return (
          splitName.length > 0 &&
          accept?.includes(splitName[splitName.length - 1])
        );
      }
      return false;
    },
    onChange(info) {
      const { status } = info.file;
      setTotalFileCount(info.fileList.length);
      setShowProgressBar(true);
      if (status === 'done') {
        setUploadedFileCount((prev) => prev + 1);
        setSuccessCount((prev) => prev + 1);
      } else if (!status || status === 'error') {
        if (info?.file?.response?.Error?.code === 'EX-00038') {
          setFileSizeExceededFailedCount((prev) => prev + 1);
        } else {
          setFailedCount((prev) => prev + 1);
        }
        setShowProgressBar(false);
      }
      let isUploading = false;
      info.fileList?.forEach((f) => {
        if (f?.status === 'uploading') {
          isUploading = true;
        }
      });

      if (!isUploading) {
        setPageNum && setPageNum(1);
        fileUploadSuccess && fileUploadSuccess();
        setUploadedFileCount(0);
        setShowProgressBar(false);
        window.removeEventListener('beforeunload', uploadInProgress);
        refetchData && refetchData();
        info.fileList.length = 0;
        updateResetFilesFilter(true)
      }
    },
  };

  return {
    t,
    showProgressBar,
    uploadedFileCount,
    totalFileCount,
    uploadPercentage,
    uploadProps,
    successCount,
  };
};

export default useFileUpload;
