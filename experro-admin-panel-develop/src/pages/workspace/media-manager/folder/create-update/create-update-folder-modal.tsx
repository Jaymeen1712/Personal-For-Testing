import React from 'react';
import { Button, Form, Input } from 'antd';

import Modal from '../../../../../components/modal';
import useCreateUpdateFolderController from './create-update-folder-modal-controller';
import FolderBreadcrumb from '../../folder-breadcrumb';
import { IFolder, IFolderBreadcrumb } from '../../../../../types';

interface CreateUpdateFolderModalProps {
  isCreateUpdateFolderModalVisible: boolean;
  hideCreateUpdateFolderModal: () => void;
  selectedFolder?: IFolder;
  breadcrumbItems: IFolderBreadcrumb[];
  folderId: string;
  folderDepth: number;
  setCurrentFolderId?: (folderId: string) => void;
  isPopUp?: boolean;
}

const CreateUpdateFolderModal: React.FC<CreateUpdateFolderModalProps> = ({
  isCreateUpdateFolderModalVisible,
  hideCreateUpdateFolderModal,
  selectedFolder,
  breadcrumbItems,
  folderId,
  folderDepth,
  setCurrentFolderId,
  isPopUp,
}) => {
  const {
    t,
    isInputChanged,
    onSave,
    form,
    createFolder,
    updateFolder,
    onFormChange,
  } = useCreateUpdateFolderController(
    folderId,
    hideCreateUpdateFolderModal,
    folderDepth,
    selectedFolder,
    setCurrentFolderId,
    isPopUp
  );

  return (
    <Modal
      classname="CustomModal CustomModal-small navigation-modal"
      isModalVisibility={isCreateUpdateFolderModalVisible}
      title={
        selectedFolder
          ? t('common.labels.rename_folder_title')
          : t('common.labels.create_folder_title')
      }
      hideModal={hideCreateUpdateFolderModal}
      footer={[
        <Button key="cancel" onClick={hideCreateUpdateFolderModal}>
          {t('common.labels.cancel')}
        </Button>,
        <Button
          key="submit"
          type="primary"
          disabled={!isInputChanged}
          loading={
            selectedFolder ? updateFolder.isLoading : createFolder.isLoading
          }
          onClick={onSave}>
          {selectedFolder ? t('common.labels.save') : t('common.labels.create')}
        </Button>,
      ]}>
      {!selectedFolder && (
        <FolderBreadcrumb folders={breadcrumbItems} isNavigation={false} />
      )}
      <Form
        autoComplete="off"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout="vertical"
        onChange={onFormChange}
        initialValues={selectedFolder}
        key={selectedFolder?.id}
        form={form}>
        <div className="m-b-8">
          <Form.Item
            label={t('common.labels.folder_name')}
            name="name"
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.folder_name'),
                }),
              },
            ]}>
            <Input
              className="w-100 m-0"
              placeholder={t('common.labels.folder_name_placeholder')}
              autoFocus={true}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUpdateFolderModal;
