import { Button, Form, Input, Typography } from 'antd';
import React from 'react';
import { TFunction } from 'react-i18next';
import { FormInstance } from 'antd/es/form';

import LoginArrowLineIcon from '../../../../images/icons/login-arrow-line-icon';

const { Link } = Typography;

interface IAuthAppValidate {
  t: TFunction<'translation', undefined>;
  twoFactorAuthenticationUsingAuthApp: FormInstance;
  onTwoFactorAuthenticationUsingApp: (value: {
    authAppCode?: string;
    recoveryCode?: string;
  }) => void;
  onRedirectToLogin: () => void;
  isRecoveryKeyVisible: boolean;
  onGoBack: () => void;
  onAuthenticateUsingRecoverykey: () => void;
  type?: string;
  selectedPreference?: string;
  onSwitchToAuthEmailAuthentication?: () => void;
}

const AuthAppValidate: React.FC<IAuthAppValidate> = ({
  t,
  twoFactorAuthenticationUsingAuthApp,
  onTwoFactorAuthenticationUsingApp,
  onRedirectToLogin,
  isRecoveryKeyVisible,
  onGoBack,
  onAuthenticateUsingRecoverykey,
  type,
  selectedPreference,
  onSwitchToAuthEmailAuthentication,
}) => {
  return (
    <>
      <h1 className='h4'>{t('common.labels.two_factor_auth')}</h1>
      <p className="m-b-40">
        {isRecoveryKeyVisible
          ? t('common.labels.login_with_recovery')
          : t('common.labels.view_auth_code')}
      </p>
      <Form
       layout="vertical"
        autoComplete="off"
        form={twoFactorAuthenticationUsingAuthApp}
        name="two_factor_authentication-using-app-form"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        onFinish={onTwoFactorAuthenticationUsingApp}>
        {isRecoveryKeyVisible ? (
          <Form.Item
            name="recoveryCode"
            className="w-100"
            label={t('common.labels.recovery_key')}
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.recovery_key'),
                }),
              },
            ]}>
            <Input placeholder={t('common.labels.recovery_key_placeholder')} size={'large'}/>
          </Form.Item>
        ) : (
          <Form.Item
            name="authAppCode"
            className="w-100"
            label={t('common.labels.auth_code')}
            rules={[
              {
                required: true,
                message: t('common.messages.required', {
                  entity: t('common.labels.auth_code'),
                }),
              },
            ]}>
            <Input placeholder={t('common.labels.enter_code_validation')} size={'large'}/>
          </Form.Item>
        )}

        <Form.Item wrapperCol={{ span: 24 }} className="m-b-24">
          <Button
            id={t('common.labels.submit')}
            type="primary"
            htmlType="submit"
            className="w-100"
            size="large">
            {t('common.labels.continue')}
          </Button>
        </Form.Item>
        {type === 'authenticateUsingBoth' &&
          selectedPreference === 'authenticator_app' &&
          !isRecoveryKeyVisible && (
            <div className="text-center m-b-16">
              <Button
                onClick={onSwitchToAuthEmailAuthentication}
                type="link"
                className="secondary-link">
                {t('common.labels.switch_to_email_auth')}
              </Button>
            </div>
          )}

        {type === 'authenticateUsingBoth' &&
        selectedPreference === 'authenticator_app' &&
        isRecoveryKeyVisible ? (
          <div className="ant-row ant-row-space-between m-b-16">
            <Button
              className="login-black-back-btn padding-0"
              onClick={onGoBack}
              icon={<LoginArrowLineIcon />}>
              {t('common.labels.go_back')}
            </Button>
            {type === 'authenticateUsingBoth' &&
              selectedPreference === 'authenticator_app' && (
                <div className="text-center">
                  <Button
                    onClick={onSwitchToAuthEmailAuthentication}
                    type="link"
                    className="secondary-link m-0">
                    {t('common.labels.switch_to_email_auth')}
                  </Button>
                </div>
              )}
          </div>
        ) : (
          isRecoveryKeyVisible && (
            <div className="text-center m-b-16">
              <Button
                className="login-black-back-btn w-100"
                onClick={onGoBack}
                icon={<LoginArrowLineIcon />}>
                {t('common.labels.go_back')}
              </Button>
            </div>
          )
        )}

        {!isRecoveryKeyVisible && (
          <div className="text-center m-b-16 ant-row ant-row-center">
            <p className="m-0">
              {t('common.labels.do_not_have_your_mobile_device')}
              <Button
                onClick={onAuthenticateUsingRecoverykey}
                type="link"
                className="secondary-link font-normal">
                {t('common.labels.enter_a_recovery_key')}
              </Button>
            </p>
          </div>
        )}

        {isRecoveryKeyVisible && (
          <div className="text-center m-b-16 ant-row ant-row-center">
            <p className="m-0">
              {t('common.labels.do_not_have_your_recovery_key')}
              <Button
                className='font-normal'
                type="link"
                href="https://www.experro.com/contact-us/">
                {t('common.labels.contactus')}
              </Button>
            </p>
          </div>
        )}

        
        <div className="text-center">
          <Link onClick={onRedirectToLogin} className="secondary-link m-0">
            {t('common.labels.return_to_login_forget_password')}
          </Link>
        </div>
      </Form>
    </>
  );
};

export default AuthAppValidate;
