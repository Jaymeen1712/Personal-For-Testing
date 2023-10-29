import React from 'react';
import { Button, Form, Input, Modal } from 'antd';

import useUpdateVersionNameModalController from './update-version-name-modal-controller';

const UpdateVersionNameModal: React.FC<{
  versionNo?: string;
  versionName?: string;
  updateVersionId?: string;
  changeUpdateVersionNameModalVisibility: (val: boolean) => void;
  versionDetailUpdateSuccessfully?: () => void;
}> = ({
  versionNo,
  versionName,
  changeUpdateVersionNameModalVisibility,
  updateVersionId,
  versionDetailUpdateSuccessfully,
}) => {
  const {
    t,
    onSave,
    form,
    updateVersionName,
    isUpdateVersionButtonDisabled,
    onFormValueChange,
  } = useUpdateVersionNameModalController(
    changeUpdateVersionNameModalVisibility,
    updateVersionId,
    versionDetailUpdateSuccessfully,
    versionName
  );
  return (
    <Modal
      visible
      onCancel={() => {
        changeUpdateVersionNameModalVisibility(false);
      }}
      title={t('common.labels.edit_version_details')}
      className="CustomModal CustomModal-small"
      centered
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            changeUpdateVersionNameModalVisibility(false);
          }}>
          {t('common.labels.cancel')}
        </Button>,
        <Button
          disabled={isUpdateVersionButtonDisabled}
          key="save"
          type="primary"
          onClick={onSave}
          loading={updateVersionName.isLoading}>
          {t('common.labels.save')}
        </Button>,
      ]}>
      <Form
        layout="vertical"
        form={form}
        onValuesChange={onFormValueChange}
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}>
        <Form.Item
          label={t('common.labels.version_name')}
          name="versionName"
          initialValue={versionName}
          rules={[
            {
              required: true,
              message: t('common.messages.Version_name_required_message'),
            },
          ]}
          normalize={(value) => value.trimStart()}>
          <Input
            value={versionName}
            maxLength={32}
            placeholder={t('common.labels.enter_version_name_placeholder')}
          />
        </Form.Item>

        <Form.Item label="Version" initialValue={versionNo}>
          <Input disabled value={versionNo} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateVersionNameModal;
