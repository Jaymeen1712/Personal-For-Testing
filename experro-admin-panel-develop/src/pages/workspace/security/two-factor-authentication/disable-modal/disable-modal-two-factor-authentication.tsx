import { Form, Input } from 'antd';
import Modal from '../../../../../components/modal';
import React from 'react';
import { TFunction } from 'react-i18next';
import { FormInstance } from 'antd/es/form';

interface IDisableModal {
  t: TFunction<'translation', undefined>;
  isDisableTwoFactorModalVisible: boolean;
  isDisableTwoFactorEmailModalVisible: boolean;
  isDisableTwoFactorAuthenticationUsingAppModalVisible: boolean;
  onDisableMfa: () => void;
  onHideDisableTwoFactor: () => void;
  form: FormInstance;
}

const DisableModalTwoFactorAuthentication: React.FC<IDisableModal> = ({
  t,
  isDisableTwoFactorModalVisible,
  isDisableTwoFactorEmailModalVisible,
  isDisableTwoFactorAuthenticationUsingAppModalVisible,
  onDisableMfa,
  onHideDisableTwoFactor,
  form,
}) => {
  return (
    <Modal
    classname='confirm-modal'
      isModalVisibility={
        isDisableTwoFactorModalVisible ||
        isDisableTwoFactorEmailModalVisible ||
        isDisableTwoFactorAuthenticationUsingAppModalVisible
      }
      title={t('common.labels.delete_folder_title')}
      okText={t('common.labels.disable')}
      onOK={onDisableMfa}
      hideModal={onHideDisableTwoFactor}>
      <div className="user-delete-modal">
        <p className="m-b-8 font-medium">
          {isDisableTwoFactorModalVisible
            ? t('common.labels.disable_mfa_header')
            : isDisableTwoFactorEmailModalVisible
            ? t(
                'common.labels.disable_two_factor_authentication_using_email_header'
              )
            : isDisableTwoFactorAuthenticationUsingAppModalVisible &&
              t(
                'common.labels.disable_two_factor_authentication_using_app_header'
              )}
        </p>
        <p className="gray-text m-b-24">
          {isDisableTwoFactorModalVisible
            ? t('common.labels.disable_mfa_subheader')
            : isDisableTwoFactorEmailModalVisible
            ? t(
                'common.labels.disable_two_factor_authentication_using_email_subheader'
              )
            : t(
                'common.labels.disable_two_factor_authentication_using_app_subheader'
              )}
        </p>
      </div>
      <Form
        autoComplete="off"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout="vertical"
        form={form}>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: t('common.messages.required', {
                entity: t('common.labels.password'),
              }),
            },
          ]}>
          <Input.Password
            placeholder={t('common.labels.enter_your_password')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DisableModalTwoFactorAuthentication;
