import { Button, Col, Form, Input, Row, Typography } from 'antd';
import React from 'react';
import { TFunction } from 'react-i18next';
import { FormInstance } from 'antd/es/form';

const { Link } = Typography;

interface IEmailValidate {
  t: TFunction<'translation', undefined>;
  twoFactorUsingEmail: FormInstance;
  onTwoFactorAuthenticationUsingEmail: (value: { emailCode: string }) => void;
  onResendCode: () => void;
  onRedirectToLogin: () => void;
  type?: string;
  selectedPreference?: string;
  onSwitchToAuthAppAuthentication?: () => void;
}

const EmailValidate: React.FC<IEmailValidate> = ({
  t,
  twoFactorUsingEmail,
  onTwoFactorAuthenticationUsingEmail,
  onResendCode,
  onRedirectToLogin,
  type,
  selectedPreference,
  onSwitchToAuthAppAuthentication,
}) => {
  return (
    <>
      <h1 className='h4'>{t('common.labels.two_factor_auth')}</h1>
      <p className="m-b-40">{t('common.labels.open_email_view_code')}</p>
      <Form
        layout='vertical'
        autoComplete="off"
        form={twoFactorUsingEmail}
        name="two_factor_authentication-using-email-form"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        onFinish={onTwoFactorAuthenticationUsingEmail}>
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

        <Row gutter={16} className='m-b-24'>
          <Col className="gutter-row  lh-normal" span={12}>
            <Button onClick={onResendCode} type="link" className='font-normal'>
              {t('common.labels.resend_code')}
            </Button>
          </Col>
        </Row>

        <Form.Item wrapperCol={{ span: 24 }} className='m-b-24'>
          <Button
            id={t('common.labels.submit')}
            type="primary"
            htmlType="submit"
            className="w-100"
            size="large">
            {t('common.labels.continue')}
          </Button>
        </Form.Item>

        {type === 'authenticateUsingBoth' && selectedPreference === 'email' && (
          <div className="text-center m-b-16">
            <Button
              onClick={onSwitchToAuthAppAuthentication}
              type="link"
              className="secondary-link">
              {t('common.labels.switch_to_auth_app_authentication')}
            </Button>
          </div>
        )}

        <div className="text-center">
          <Link onClick={onRedirectToLogin} className="secondary-link">
            {t('common.labels.return_to_login_forget_password')}
          </Link>
        </div>
      </Form>
    </>
  );
};

export default EmailValidate;
