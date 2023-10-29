import React from 'react';
import { Button, Form, Input } from 'antd';

import Modal from '../../../../components/modal';
import { IWorkspace } from '../../../../types';
import useDeleteWorkspaceModalController from './delete-workspace-modal-controller';

interface DeleteWorkspaceModalProps {
  isDeleteModalVisible: boolean;
  hideDeleteModal: () => void;
  workspace?: IWorkspace | undefined;
}

const DeleteWorkspaceModal: React.FC<DeleteWorkspaceModalProps> = ({
  isDeleteModalVisible,
  hideDeleteModal,
  workspace,
}) => {
  const { t, onSave, isButtonDisable, onFieldChange, form, deleteWorkspace } =
    useDeleteWorkspaceModalController(workspace);

  if (!isDeleteModalVisible) {
    form.resetFields();
  }

  return (
    <Modal
      classname="confirm-modal"
      isModalVisibility={isDeleteModalVisible}
      hideModal={hideDeleteModal}
      title={t('common.messages.delete_workspace_for', {
        name: `${workspace?.name}`,
      })}
      footer={[
        <Button key="back" onClick={hideDeleteModal}>
          {t('common.labels.cancel')}
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onSave}
          loading={deleteWorkspace.isLoading}
          disabled={isButtonDisable}
          danger>
          {t('common.labels.delete')}
        </Button>,
      ]}>
      <p className="text-red m-b-4 m-0">
        {t('common.labels.deleting_your_space_permanent')}
      </p>
      <p className="m-0 m-b-24">
        {t('common.labels.all_data_wiped_immediately')}
      </p>
      <Form
        autoComplete="off"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onFieldsChange={onFieldChange}
        layout="vertical"
        form={form}>
        <Form.Item
          name="name"
          label={t('common.labels.delete_modal_type_workspace_name')}>
          <Input placeholder={t('common.labels.enter_workspace_name')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default DeleteWorkspaceModal;
