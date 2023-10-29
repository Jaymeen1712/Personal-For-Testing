import { Button, Form, Input, Modal } from 'antd';
import React from 'react';
import useCreateUpdateFolderModalController from './create-update-folder-modal-controller';

interface ModalProps {
  isVisible: boolean;
  onModalVisibilityChange: (val: boolean, isEmptyData: boolean) => void;
  editFolderStatus: {
    folderId: string;
    folderName: string;
    position: number;
    status: boolean;
  };
  addNewType: string;
  titleAndSubtitleChange: (title: string, subTitle: string) => void;
}

const CreateUpdateFolderModal: React.FC<ModalProps> = ({
  isVisible,
  onModalVisibilityChange,
  editFolderStatus,
  addNewType,
  titleAndSubtitleChange,
}) => {
  const {
    t,
    form,
    onSave,
    loading,
    onDelete,
    deleteButtonLoading,
    onHideDeleteModal,
    onDeleteModal,
    isDeleteFolderModalVisible,
    isCreateFolderButtonVisible,
    onFormValueChange
  } = useCreateUpdateFolderModalController(
    onModalVisibilityChange,
    editFolderStatus,
    addNewType,
    titleAndSubtitleChange
  );
  return (
    <>
      <Modal
        open={isVisible}
        title={
          editFolderStatus.status
            ? t('common.labels.edit_folder')
            : t('common.labels.create_folder')
        }
        centered
        className="CustomModal CustomModal-small"
        onCancel={() => {
          onModalVisibilityChange(false, true);
        }}
        footer={[
          <div
            className={
              editFolderStatus.status ? 'ant-row ant-row-space-between' : ''
            }>
            {editFolderStatus.status && (
              <div className="custom-delete-button">
                <Button
                  loading={deleteButtonLoading}
                  key="delete"
                  type="link"
                  danger
                  onClick={onDelete}>
                  {t('common.labels.delete')}
                </Button>
              </div>
            )}
            <div>
              <Button
                key="cancel"
                onClick={() => {
                  onModalVisibilityChange(false, true);
                }}>
                {t('common.labels.cancel')}
              </Button>
              <>
                <Button
                  disabled={isCreateFolderButtonVisible}
                  key="save"
                  type="primary"
                  onClick={onSave}
                  loading={loading}>
                  {t('common.labels.save')}
                </Button>
              </>
            </div>
          </div>,
        ]}>
        <Form
          onValuesChange={onFormValueChange}
          layout="vertical"
          form={form}
          className="m-b-8"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}>
          <Form.Item
            name="groupName"
            label={t('common.labels.folder_name')}
            rules={[
              {
                required: true,
                message: t('common.messages.error_folder_name_required'),
              },
              {
                whitespace: true,
                message: t('common.messages.please_provide'),
              },
            ]}>
            <Input placeholder={t('common.labels.folder_name_placeholder')} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        className="confirm-modal"
        open={isDeleteFolderModalVisible}
        title={t('common.labels.delete_folder')}
        centered
        onCancel={onHideDeleteModal}
        footer={[
          <Button key="back" onClick={onHideDeleteModal}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={onDeleteModal}
            loading={deleteButtonLoading}
            danger>
            {t('common.labels.delete')}
          </Button>,
        ]}>
        {t('common.messages.content_modal_delete_folder_confirm_message')}
      </Modal>
    </>
  );
};
export default CreateUpdateFolderModal;
