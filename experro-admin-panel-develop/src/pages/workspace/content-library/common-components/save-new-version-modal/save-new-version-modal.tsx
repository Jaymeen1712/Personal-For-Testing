import { Button, Form, Input, Modal } from 'antd';

import useSaveNewVersionModalController from './save-new-version-modal-controller';
import React from 'react';

interface SaveModalProp {
  isModalVisible?: boolean;
  onSave: (val: { versionName: string; versionNo: number }) => void;
  Loading?: boolean;
  nextVersionNo?: string;
  type?: string;
  changeSaveAsNewVersionModalVisibility: (val: boolean) => void;
}

const SaveNewVersionModal: React.FC<SaveModalProp> = ({
  isModalVisible,
  onSave,
  Loading,
  nextVersionNo,
  type,
  changeSaveAsNewVersionModalVisibility,
}) => {
  const {
    t,
    form,
    onSaveButtonClick,
    isSaveAsNewVersionButtonDisabled,
    onFormValuesChange,
  } = useSaveNewVersionModalController(onSave);
  return (
    <Modal
      title={
        type === 'saveAsNew'
          ? t('common.labels.save_as_new_version')
          : t('common.labels.clone_version')
      }
      className="CustomModal-small CustomModal"
      open={isModalVisible}
      onCancel={() => {
        changeSaveAsNewVersionModalVisibility(false);
        form.resetFields();
      }}
      centered
      footer={[
        <Button
          onClick={() => {
            form.resetFields();
            changeSaveAsNewVersionModalVisibility(false);
          }}
          key="cancel">
          {t('common.labels.cancel')}
        </Button>,
        <Button
          disabled={isSaveAsNewVersionButtonDisabled}
          onClick={onSaveButtonClick}
          type="primary"
          key="Save"
          loading={Loading}>
          {t('common.labels.save')}
        </Button>,
      ]}>
      <Form
        onValuesChange={onFormValuesChange}
        layout="vertical"
        form={form}
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}>
        <Form.Item
          label={t('common.labels.version_name')}
          name="versionName"
          rules={[
            {
              required: true,
              message: t('common.messages.Version_name_required_message'),
            },
          ]}
          normalize={(value) => value.trimStart()}>
          <Input
            maxLength={32}
            placeholder={t('common.labels.enter_version_name_placeholder')}
          />
        </Form.Item>

        <Form.Item
          label={t('common.labels.version_number')}
          name="versionNo"
          initialValue={nextVersionNo}>
          <Input disabled value={nextVersionNo} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default SaveNewVersionModal;
