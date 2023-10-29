import React from 'react';
import { Button, Form, Input } from 'antd';

import useChangePasswordController from './change-password-controller';
import { Password } from '../../../../components/password';

const ChangePassword: React.FC = () => {
  const {
    form,
    t,
    passwordStrength,
    onFinish,
    onValuesChange,
    changePassword,
    isUpdateButtonDisable,
    onCancel,
  } = useChangePasswordController();

  return (
    <Form
      name="basic"
      layout="vertical"
      className="w-420"
      labelCol={{ span: 24 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      autoComplete="off"
      form={form}>
      <Form.Item
        name="oldPassword"
        label={t('common.labels.old_password_label')}
        rules={[
          {
            required: true,
            message: t('common.messages.old_password_message_security'),
          },
        ]}
        hasFeedback>
        <Input.Password placeholder={t('common.labels.enter_password')} />
      </Form.Item>
      <Password
        passwordStrength={passwordStrength}
        name="newPassword"
        errorLabel={t('common.labels.new_password_error')}
        label={t('common.labels.new_password_label')}
      />
      <div className="profile-action p-t-16">
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={changePassword.isLoading ? true : false}
            disabled={isUpdateButtonDisable}>
            {t('common.labels.update')}
          </Button>

          <Button
            type="default"
            id={t('common.labels.cancel')}
            disabled={isUpdateButtonDisable}
            onClick={onCancel}>
            {t('common.labels.cancel')}
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default ChangePassword;
