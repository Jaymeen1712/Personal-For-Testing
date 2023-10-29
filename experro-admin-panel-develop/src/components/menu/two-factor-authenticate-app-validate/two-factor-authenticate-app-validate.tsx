import { Button, Form, Input } from 'antd';
import React from 'react';
import { TFunction } from 'react-i18next';
import { FormInstance } from 'antd/es/form';
import LoginArrowLineIcon from '../../../images/icons/login-arrow-line-icon';

interface ITwoFactorAuthenticateAppValidate {
  t: TFunction<'translation', undefined>;
  twoFactorAuthenticationUsingAuthApp: FormInstance;
  isRecoveryKeyVisible: boolean;
  authenticationUsingBoth: boolean;
  preference: string;
  onGoBack: () => void;
  onSwitchToAuthEmailAuthentication: () => void;
  onAuthenticateUsingRecoverykey: () => void;
}

const TwoFactorAuthenticateAppValidate: React.FC<
  ITwoFactorAuthenticateAppValidate
> = ({
  t,
  twoFactorAuthenticationUsingAuthApp,
  isRecoveryKeyVisible,
  authenticationUsingBoth,
  preference,
  onGoBack,
  onSwitchToAuthEmailAuthentication,
  onAuthenticateUsingRecoverykey,
}) => {
  return (
    <>
      <p className="m-b-28">
        {isRecoveryKeyVisible
          ? t('common.labels.login_with_recovery')
          : t('common.labels.view_auth_code')}
      </p>
      <Form
        autoComplete="off"
        form={twoFactorAuthenticationUsingAuthApp}
        name="two_factor_authentication-using-app-form"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}>
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
            <Input placeholder={t('common.labels.enter_code_validation')} />
          </Form.Item>
        )}

        {authenticationUsingBoth &&
        preference === 'authenticator_app' &&
        isRecoveryKeyVisible ? (
          <div className="ant-row ant-row-space-between m-t-32 m-b-16">
            <Button
              className="login-black-back-btn padding-0"
              onClick={onGoBack}
              icon={<LoginArrowLineIcon />}>
              {t('common.labels.go_back')}
            </Button>
            {authenticationUsingBoth && preference === 'authenticator_app' && (
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
            <div className="text-center m-t-32 m-b-16">
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
          <div className="text-center m-t-32 m-b-16 ant-row ant-row-center">
            <p className="m-0">
              {t('common.labels.do_not_have_your_mobile_device')}
              <Button
                onClick={onAuthenticateUsingRecoverykey}
                type="link"
                className="secondary-link">
                {t('common.labels.enter_a_recovery_key')}
              </Button>
            </p>
          </div>
        )}

        {isRecoveryKeyVisible && (
          <div className="text-center m-0 ant-row ant-row-center">
            <p className="m-0">
              {t('common.labels.do_not_have_your_recovery_key')}
              <Button
                type="link"
                href="https://www.experro.com/contact-us/"
                className="secondary-link font-normal">
                {t('common.labels.contactus')}
              </Button>
            </p>
          </div>
        )}

        {authenticationUsingBoth &&
          preference === 'authenticator_app' &&
          !isRecoveryKeyVisible && (
            <div className="text-center m-0">
              <Button
                onClick={onSwitchToAuthEmailAuthentication}
                type="link"
                className="secondary-link">
                {t('common.labels.switch_to_email_auth')}
              </Button>
            </div>
          )}
      </Form>
    </>
  );
};

export default TwoFactorAuthenticateAppValidate;
