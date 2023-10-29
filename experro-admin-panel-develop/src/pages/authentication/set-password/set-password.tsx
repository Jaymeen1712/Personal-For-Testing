import React from 'react';
import { Button, Form } from 'antd';
import ReCAPTCHA from 'react-google-recaptcha';

import AuthContainer from '../../../components/auth-container';
import useSetPasswordController from './set-password-controller';
import { Password } from '../../../components/password';
import ResetPasswordEmail from './success';
import { GOOGLE_CAPTCHA_KEY } from '../../../utills';

interface SetPasswordProps {
  isResetPassword?: boolean;
}

const SetPassword: React.FC<SetPasswordProps> = ({
  isResetPassword = false,
}) => {
  const {
    t,
    onFinish,
    onValuesChange,
    passwordStrength,
    setPassword,
    isRequestCompleted,
    redirectToLogin,
    isCaptchaLoaded,
    onCaptchaLoaded,
    captchaToken,
    form,
    recaptchaRef,
  } = useSetPasswordController({ isResetPassword });

  return (
    <AuthContainer showSignUpLink={false}>
      {isRequestCompleted ? (
        <ResetPasswordEmail
          isResetPassword={isResetPassword}
          redirectToLogin={redirectToLogin}
          t={t}
        />
      ) : (
        <>
          <h1 className="h4">
            {isResetPassword
              ? t('common.labels.reset_password')
              : t('common.labels.set_password')}
          </h1>
          <p className="m-b-40">{t('common.labels.choose_new_password')}</p>
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
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            autoComplete="off"
            form={form}>
            <Password
              passwordStrength={passwordStrength}
              name="password"
              label={
                isResetPassword
                  ? t('common.labels.new_password')
                  : t('common.labels.password')
              }
              errorLabel={
                isResetPassword
                  ? t('common.labels.new_password_error')
                  : t('common.labels.password')
              }
              autoFocus={true}
            />

            {isCaptchaLoaded && (
              <ReCAPTCHA
                ref={recaptchaRef}
                className="m-b-40"
                sitekey={GOOGLE_CAPTCHA_KEY}
                onChange={onCaptchaLoaded}
              />
            )}

            <Button
              id={t('common.labels.reset_password')}
              type="primary"
              htmlType="submit"
              className="w-100"
              size="large"
              disabled={captchaToken === '' || captchaToken === null}
              loading={setPassword.isLoading ? true : false}>
              {isResetPassword
                ? t('common.labels.reset_password')
                : t('common.labels.set_password')}
            </Button>
          </Form>
        </>
      )}
    </AuthContainer>
  );
};

export default SetPassword;
