import React from 'react';

import Modal from '../../../../../components/modal';
import useDeleteFileModalController from './delete-file-modal-controller';
import { IFile } from '../../../../../types';

interface DeleteFileModalProps {
  confirmationMessage: string;
  workspaceId: string;
  folderId?: string;
  isDeleteModalVisible: boolean;
  hideDeleteModal: () => void;
  // eslint-disable-next-line
  selectedFiles?: any;
  setSelectedFiles?: (fileId: IFile[]) => void;
  refetchData: () => void;
}

const DeleteFileModal: React.FC<DeleteFileModalProps> = ({
  confirmationMessage,
  workspaceId,
  folderId,
  isDeleteModalVisible,
  selectedFiles,
  hideDeleteModal,
  refetchData,
  setSelectedFiles,
}) => {
  const { t, onDeleteFile, deleteFile } = useDeleteFileModalController(
    workspaceId,
    hideDeleteModal,
    refetchData,
    setSelectedFiles,
    folderId,
    selectedFiles
  );

  return (
    <Modal
      classname='confirm-modal'
      title={t('common.labels.delete_folder_title')}
      isModalVisibility={isDeleteModalVisible}
      okText={t('common.labels.delete')}
      hideModal={hideDeleteModal}
      confirmLoading={deleteFile.isLoading}
      onOK={onDeleteFile}>
      <p>{confirmationMessage}</p>
    </Modal>
  );
};

export default DeleteFileModal;
