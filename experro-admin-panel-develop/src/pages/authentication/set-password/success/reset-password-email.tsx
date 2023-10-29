import React from 'react';
import { Button } from 'antd';
import { TFunction } from 'react-i18next';

interface IResetPasswordEmail {
  isResetPassword: boolean;
  redirectToLogin: () => void;
  t: TFunction<'translation', undefined>;
}

const ResetPasswordEmail: React.FC<IResetPasswordEmail> = ({
  isResetPassword,
  redirectToLogin,
  t,
}) => {
  return (
    <div className="site-card-border-less-wrapper">
      <h1 className="m-0 h4">
        {isResetPassword
          ? t('common.labels.reset_successful')
          : t('common.labels.set_successfully')}
      </h1>
      <p className="m-b-32 email-notification-text">
        {isResetPassword
          ? t('common.labels.password_reset_successfully')
          : t('common.labels.password_set_successfully')}
      </p>
      <div>
        <Button
          className="w-100"
          size="large"
          type="primary"
          htmlType="submit"
          onClick={redirectToLogin}>
          {t('common.labels.return_to_login_forget_password')}
        </Button>
      </div>
    </div>
  );
};
export default ResetPasswordEmail;
