import React from 'react';
import { Button, Form, Input, Modal } from 'antd';

import { IWorkspace } from '../../../../types';
import useDeleteWorkspaceModalController from './delete-workspace-modal-controller';

interface DeleteWorkspaceModalProps {
  isDeleteModalVisible: boolean;
  hideDeleteModal: () => void;
  workspaceId?: string;
  workspace?: IWorkspace | undefined;
}

const DeleteWorkspaceModal: React.FC<DeleteWorkspaceModalProps> = ({
  isDeleteModalVisible,
  hideDeleteModal,
  workspace,
  workspaceId,
}) => {
  const { t, onSave, isButtonDisable, onFieldChange, form, deleteWorkspace } =
    useDeleteWorkspaceModalController(workspaceId, workspace);

  if (!isDeleteModalVisible) {
    form.resetFields();
  }

  return (
    <Modal
      className="confirm-modal"
      open={isDeleteModalVisible}
      onCancel={hideDeleteModal}
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
          loading={deleteWorkspace.isLoading ? true : false}
          disabled={isButtonDisable}
          danger>
          {t('common.labels.delete')}
        </Button>,
      ]}
      centered>
      <p className="text-red m-b-4 m-0">
        {t('common.labels.deleting_your_space_permanent')}
      </p>
      <p>{t('common.labels.all_data_wiped_immediately')}</p>
      <Form
        autoComplete="off"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onFieldsChange={onFieldChange}
        layout="vertical"
        form={form}>
        <Form.Item
          label={t('common.labels.delete_modal_type_workspace_name')}
          name="name"
          rules={[
            {
              required: true,
              message: t('common.messages.required', {
                entity: t('common.labels.workspace_name'),
              }),
            },
          ]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DeleteWorkspaceModal;
