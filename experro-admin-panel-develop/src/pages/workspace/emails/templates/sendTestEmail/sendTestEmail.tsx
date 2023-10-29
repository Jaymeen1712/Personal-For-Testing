import React from 'react';
import { Button, Form, Input } from 'antd';

import Modal from '../../../../../components/modal';

import useSendTestEmailController from './sendTestEmail-controller';

interface ISendTestEmail {
  isSendTestEmailModalVisible: boolean;
  onHideSendTestEmail: () => void;
  templateId: string;
}

const SendTestEmail: React.FC<ISendTestEmail> = ({
  isSendTestEmailModalVisible,
  onHideSendTestEmail,
  templateId,
}) => {
  const {
    onCloseSendTestEmail,
    handleFieldChange,
    disableSave,
    sendTestEmail,
    onSave,
    form,
    t,
  } = useSendTestEmailController({
    templateId,
    onHideSendTestEmail,
  });

  return (
    <Modal
      isModalVisibility={isSendTestEmailModalVisible}
      title={t('common.labels.send_test_mail')}
      hideModal={onCloseSendTestEmail}
      classname="CustomModal CustomModal-small"
      footer={[
        <Button key="back" onClick={onCloseSendTestEmail}>
          {t('common.labels.cancel')}
        </Button>,
        <Button
          key="submit"
          type="primary"
          disabled={disableSave}
          loading={sendTestEmail.isLoading}
          onClick={onSave}>
          {t('common.labels.send')}
        </Button>,
      ]}>
      <Form
        form={form}
        autoComplete="off"
        id="sendTestEmail-form"
        layout="vertical"
        className="m-b-8"
        onFieldsChange={handleFieldChange}
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}>
        <Form.Item
          name="email"
          label={t('common.labels.email')}
          rules={[
            {
              required: true,
              message: t('common.messages.required', {
                entity: t('common.labels.email'),
              }),
            },
          ]}>
          <Input
            placeholder={t('common.labels.email_placeholder')}
            className="w-100"></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SendTestEmail;
