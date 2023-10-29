import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useError from '../../../../../hooks/error';
import { API_QUERY_KEY, openNotificationWithIcon } from '../../../../../utills';
import { useDeleteFile } from '../../services';
import { IFile } from '../../../../../types';
import queryClient from '../../../../../query-client';

const useDeleteFileModalController = (
  workspaceId: string,
  hideDeleteModal: () => void,
  refetchData: () => void,
  // eslint-disable-next-line
  setSelectedFiles?: (files?: any) => void,
  folderId?: string,
  // eslint-disable-next-line
  selectedFiles?: any
) => {
  const { t } = useTranslation();
  const deleteFile = useDeleteFile(workspaceId, folderId);
  useError({
    mutation: deleteFile,
    entity: t('common.labels.file'),
    cb: hideDeleteModal,
  });

  const onDeleteFile = () => {
    if (selectedFiles) {
      deleteFile.mutate(
        selectedFiles.map((file: IFile) => (file.id ? file.id : file))
      );
    }
  };

  useEffect(() => {
    if (deleteFile.isSuccess) {
      setSelectedFiles && setSelectedFiles([]);
      hideDeleteModal();
      queryClient.removeQueries([API_QUERY_KEY.GLOBAL_FILE_LIST]);
      refetchData();
      openNotificationWithIcon(
        'success',
        t('common.messages.entity_deleted_successfully', {
          entity: t('common.labels.media'),
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteFile.isSuccess, t]);

  return { t, onDeleteFile, deleteFile };
};

export default useDeleteFileModalController;
