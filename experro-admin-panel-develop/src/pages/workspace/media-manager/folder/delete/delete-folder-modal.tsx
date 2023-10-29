import React from 'react';
import useDeleteFolderModalController from './delete-folder-modal-controller';
import { IFolder } from '../../../../../types';
import { Button, Modal } from 'antd';

interface DeleteFolderModalProps {
  isDeleteModalVisible: boolean;
  hideDeleteModal: () => void;
  selectedFolder?: IFolder;
  parentFolderId?: string;
  isPopUp?: boolean;
  setCurrentFolderId: (folderId: string) => void;
  onDeleted?:() => void,
}

const DeleteFolderModal: React.FC<DeleteFolderModalProps> = ({
  onDeleted,
  isDeleteModalVisible,
  hideDeleteModal,
  selectedFolder,
  parentFolderId,
  isPopUp,
  setCurrentFolderId,
}) => {
  const { t, onDeleteFolder, isDeleteLoading } = useDeleteFolderModalController(
    hideDeleteModal,
    selectedFolder,
    selectedFolder?.parentFolderId,
    isPopUp,
    setCurrentFolderId,
    onDeleted
  );

  return (
    <Modal
      className="confirm-modal"
      open={isDeleteModalVisible}
      title={t('common.labels.delete_folder')}
      centered
      onCancel={hideDeleteModal}
      footer={[
        <Button key="back" onClick={hideDeleteModal}>
          {t('common.labels.cancel')}
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onDeleteFolder}
          loading={isDeleteLoading}
          danger>
          {t('common.labels.delete')}
        </Button>,
      ]}>
      {t('common.messages.delete_media_folder_message')}
    </Modal>
  );
};

export default DeleteFolderModal;
