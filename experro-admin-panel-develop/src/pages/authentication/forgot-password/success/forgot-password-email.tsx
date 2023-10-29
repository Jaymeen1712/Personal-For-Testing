import React from 'react';
import { Button } from 'antd';

import useForgotPasswordEmailController from './forgot-password-email-controller';
import { IForgotPassword } from '../../../../types';

const ForgotPasswordEmail: React.FC<IForgotPassword> = ({ email }) => {
  const { t, redirectToLogin } = useForgotPasswordEmailController();

  return (
    <div className="site-card-border-less-wrapper">
      <h1 className="m-0 h4">{t('common.labels.forgot_password')}</h1>
      <p className="m-b-32 email-notification-text">
        {t('common.labels.sent_email_notification_initial')}
        {email}
        {t('common.labels.sent_email_notification_back')}
      </p>
      <div className="m-b-32">
        <Button
          className="w-100"
          size="large"
          type="primary"
          htmlType="submit"
          onClick={redirectToLogin}>
          {t('common.labels.return_to_login_forget_password')}
        </Button>
      </div>
      <p className="m-0">
        <small>{t('common.labels.check_spam_if_email_not_found')}</small>
      </p>
    </div>
  );
};

export default ForgotPasswordEmail;
