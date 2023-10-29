import useProfileSecurity from './profile';
import {
  useVerifyAuthCodeTwoFactorAuthentication,
  useGenerateRecoveryCodeTwoFactorAuthentication,
  useGenerateQrTwoFactorAuthentication,
  useVerifyPasswordTwoFactorAuthentication,
} from './two-factor-authentication';
import useChangePassword from './change-password';

export {
  useChangePassword,
  useProfileSecurity,
  useVerifyPasswordTwoFactorAuthentication,
  useGenerateQrTwoFactorAuthentication,
  useVerifyAuthCodeTwoFactorAuthentication,
  useGenerateRecoveryCodeTwoFactorAuthentication,
};
