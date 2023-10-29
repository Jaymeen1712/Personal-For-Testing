import React from 'react';

import AuthContainer from '../../../components/auth-container';
import EmailValidate from './email-validate';
import AuthAppValidate from './auth-app-validate';
import useTwoFactorAuthenticationController from './two-factor-authentication-controller';

const TwoFactorAuthentication = () => {
  const {
    type,
    t,
    twoFactorUsingEmail,
    onTwoFactorAuthenticationUsingEmail,
    onResendCode,
    onRedirectToLogin,
    twoFactorAuthenticationUsingAuthApp,
    onTwoFactorAuthenticationUsingApp,
    isRecoveryKeyVisible,
    onGoBack,
    onAuthenticateUsingRecoverykey,
    selectedPreference,
    onSwitchToAuthAppAuthentication,
    onSwitchToAuthEmailAuthentication,
  } = useTwoFactorAuthenticationController();

  return (
    <>
      <AuthContainer showSignUpLink={true}>
        {type === 'email' ? (
          <EmailValidate
            t={t}
            twoFactorUsingEmail={twoFactorUsingEmail}
            onTwoFactorAuthenticationUsingEmail={
              onTwoFactorAuthenticationUsingEmail
            }
            onResendCode={onResendCode}
            onRedirectToLogin={onRedirectToLogin}
          />
        ) : type === 'authenticatorApp' ? (
          <AuthAppValidate
            t={t}
            twoFactorAuthenticationUsingAuthApp={
              twoFactorAuthenticationUsingAuthApp
            }
            onTwoFactorAuthenticationUsingApp={
              onTwoFactorAuthenticationUsingApp
            }
            onRedirectToLogin={onRedirectToLogin}
            isRecoveryKeyVisible={isRecoveryKeyVisible}
            onGoBack={onGoBack}
            onAuthenticateUsingRecoverykey={onAuthenticateUsingRecoverykey}
          />
        ) : type === 'authenticateUsingBoth' &&
          selectedPreference === 'email' ? (
          <EmailValidate
            t={t}
            twoFactorUsingEmail={twoFactorUsingEmail}
            onTwoFactorAuthenticationUsingEmail={
              onTwoFactorAuthenticationUsingEmail
            }
            onResendCode={onResendCode}
            onRedirectToLogin={onRedirectToLogin}
            type={type}
            selectedPreference={selectedPreference}
            onSwitchToAuthAppAuthentication={onSwitchToAuthAppAuthentication}
          />
        ) : (
          selectedPreference === 'authenticator_app' && (
            <AuthAppValidate
              t={t}
              twoFactorAuthenticationUsingAuthApp={
                twoFactorAuthenticationUsingAuthApp
              }
              onTwoFactorAuthenticationUsingApp={
                onTwoFactorAuthenticationUsingApp
              }
              onRedirectToLogin={onRedirectToLogin}
              isRecoveryKeyVisible={isRecoveryKeyVisible}
              onGoBack={onGoBack}
              onAuthenticateUsingRecoverykey={onAuthenticateUsingRecoverykey}
              type={type}
              selectedPreference={selectedPreference}
              onSwitchToAuthEmailAuthentication={
                onSwitchToAuthEmailAuthentication
              }
            />
          )
        )}
      </AuthContainer>
    </>
  );
};

export default TwoFactorAuthentication;
