import React from 'react';
import { Button, Form, Typography } from 'antd';
import ReCAPTCHA from 'react-google-recaptcha';

import useForgotPasswordController from './forgot-password-controller';
import AuthContainer from '../../../components/auth-container';
import ForgotPasswordEmail from './success/forgot-password-email';
import FormItems from '../../../components/form-items';
import { GOOGLE_CAPTCHA_KEY } from '../../../utills';

const { Link } = Typography;

const ForgotPassword: React.FC = () => {
  const {
    t,
    email,
    isRequestCompleted,
    onFinish,
    form,
    forgotPassword,
    onBlur,
    isCaptchaLoaded,
    onCaptchaLoaded,
    captchaToken,
    recaptchaRef,
  } = useForgotPasswordController();

  return (
    <AuthContainer showSignUpLink={false}>
      {isRequestCompleted ? (
        <ForgotPasswordEmail email={email} />
      ) : (
        <>
          <h1 className='h4'>{t('common.labels.forgot_password')}</h1>
          <p className="m-b-40">
            {t('common.labels.enter_email_associate_with_account')}
          </p>
          <Form
            layout="vertical"
            name="forgotPassword-form"
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            initialValues={{
              remember: true,
            }}
            form={form}
            onFinish={onFinish}
            autoComplete="off">
            <FormItems
              items={[
                {
                  label: t('common.labels.will_inform_you'),
                  name: 'email',
                  placeholder: t('common.labels.forgot_email_placeholder'),
                  type: 'input',
                  size: 'large',
                  classname: 'w-100',
                  onBlur: onBlur,
                  rules: [
                    {
                      required: true,
                      message: t('common.messages.required', {
                        entity: t('common.labels.email'),
                      }),
                    },
                  ],
                },
              ]}
            />

            {isCaptchaLoaded && (
              <ReCAPTCHA
                ref={recaptchaRef}
                className="m-b-40"
                sitekey={GOOGLE_CAPTCHA_KEY}
                onChange={onCaptchaLoaded}
              />
            )}

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                id={t('common.labels.reset_password')}
                type="primary"
                htmlType="submit"
                className="w-100"
                size="large"
                disabled={captchaToken === '' || captchaToken === null}
                loading={forgotPassword?.isLoading ? true : false}>
                {t('common.labels.reset_password')}
              </Button>
            </Form.Item>

            <div className="text-center">
              <Link href="/login" className="secondary-link">
                {t('common.labels.return_to_login_forget_password')}
              </Link>
            </div>
          </Form>
        </>
      )}
    </AuthContainer>
  );
};

export default ForgotPassword;
