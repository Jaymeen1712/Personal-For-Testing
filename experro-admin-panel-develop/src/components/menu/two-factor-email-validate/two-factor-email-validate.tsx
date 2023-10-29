import { Button, Form, Input } from 'antd';
import React from 'react';
import { TFunction } from 'react-i18next';
import { FormInstance } from 'antd/es/form';

interface ITwoFactorEmailValidate {
  t: TFunction<'translation', undefined>;
  twoFactorUsingEmail: FormInstance;
  onResendCode: () => void;
  authenticationUsingBoth: boolean;
  preference: string;
  onSwitchToAuthAppAuthentication: () => void;
}

const TwoFactorEmailValidate: React.FC<ITwoFactorEmailValidate> = ({
  t,
  twoFactorUsingEmail,
  onResendCode,
  authenticationUsingBoth,
  preference,
  onSwitchToAuthAppAuthentication,
}) => {
  return (
    <>
      <p className="m-b-28">{t('common.labels.open_email_view_code')}</p>
      <Form
        layout="vertical"
        autoComplete="off"
        form={twoFactorUsingEmail}
        name="two_factor_authentication-using-email-form"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}>
        <Form.Item
          name="emailCode"
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

        {authenticationUsingBoth && preference === 'email' && (
          <div className="text-center m-t-32 m-b-16">
            <Button
              onClick={onSwitchToAuthAppAuthentication}
              type="link"
              className="secondary-link">
              {t('common.labels.switch_to_auth_app_authentication')}
            </Button>
          </div>
        )}

        <div
          className={`${authenticationUsingBoth ? 'text-center' : ''} m-t-32`}>
          <Button onClick={onResendCode} type="link" className='font-normal'>
            {t('common.labels.resend_code')}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default TwoFactorEmailValidate;
