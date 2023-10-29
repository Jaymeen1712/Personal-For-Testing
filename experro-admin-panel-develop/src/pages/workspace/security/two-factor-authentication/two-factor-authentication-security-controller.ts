import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import CryptoJS from 'crypto-js';

import {
  NUMBER_REGEX_PATTERN,
  openNotificationWithIcon,
  PASSWORD_CIPHER_MESSAGE,
  PREFERENCES,
} from '../../../../utills';
import useError from '../../../../hooks/error';
import { useEnableDisableTwoFactorAuthentication } from '../services/two-factor-authentication';
import {
  useGenerateQrTwoFactorAuthentication,
  useGenerateRecoveryCodeTwoFactorAuthentication,
  useProfileSecurity,
  useVerifyAuthCodeTwoFactorAuthentication,
  useVerifyPasswordTwoFactorAuthentication,
} from '../services';

const useTwoFactorAuthenticationSecurityController = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [validateQrForm] = Form.useForm();

  const [isTwoFactorEnableDisableSwitch, setIsTwoFactorEnableDisableSwitch] =
    useState<boolean | undefined>(false);

  const [
    isTwoFactorAuthenticationUsingEmail,
    setIsTwoFactorAuthenticationUsingEmail,
  ] = useState<boolean | undefined>(false);

  const [
    isTwoFactorAuthenticationUsingApp,
    setIsTwoFactorAuthenticationUsingApp,
  ] = useState<boolean | undefined>(false);

  const [isDisableTwoFactorModalVisible, setIsDisableTwoFactorModalVisible] =
    useState<boolean>(false);

  const [
    isDisableTwoFactorEmailModalVisible,
    setIsDisableTwoFactorEmailModalVisible,
  ] = useState<boolean>(false);

  const [
    isDisableTwoFactorAuthenticationUsingAppModalVisible,
    setIsDisableTwoFactorAuthenticationUsingAppModalVisible,
  ] = useState<boolean>(false);
  const [isGenerateQrCode, setIsGenerateQrCode] = useState<boolean>(false);
  const [selectedFirstPreference, setSelectedFirstPreference] =
    useState<string>('');
  const [
    isCreateNewRecoveryKeyModalVisible,
    setIsCreateNewRecoveryKeyModalVisible,
  ] = useState<boolean>(false);
  const [isPreferenceUpdated, setIsPreferenceUpdated] =
    useState<boolean>(false);

  const profile = useProfileSecurity();
  const enableDisableTwoFactorAuthentication =
    useEnableDisableTwoFactorAuthentication();
  const verifyPasswordTwoFactorAuthentication =
    useVerifyPasswordTwoFactorAuthentication();
  const generateQrTwoFactorAuthentication =
    useGenerateQrTwoFactorAuthentication(isGenerateQrCode);
  const verifyAuthCode = useVerifyAuthCodeTwoFactorAuthentication();
  const generateRecoveryCode = useGenerateRecoveryCodeTwoFactorAuthentication();

  useError({
    mutation: verifyPasswordTwoFactorAuthentication,
    entity: t('common.labels.password'),
  });

  useError({
    mutation: verifyAuthCode,
    entity: t('common.labels.code'),
  });

  const onTwoFactorAuthenticationEnable = () => {
    enableDisableTwoFactorAuthentication.mutate({
      type: 'mfa',
      value: true,
      isInitial: false,
    });
  };

  const onTwoFactorAuthenticationSwitchChange = (switchValue: boolean) => {
    if (switchValue) {
      setIsTwoFactorEnableDisableSwitch(switchValue);
      enableDisableTwoFactorAuthentication.mutate({
        type: 'mfa_enable',
        value: true,
        isInitial: true,
      });
      openNotificationWithIcon(
        'success',
        t('common.messages.enabled_successfully')
      );
    } else {
      setIsDisableTwoFactorModalVisible(true);
    }
  };

  const onTwoFactorAuthenticationUsingEmail = (
    emailCheckBoxValue: CheckboxChangeEvent
  ) => {
    if (emailCheckBoxValue.target.checked) {
      enableDisableTwoFactorAuthentication.mutate({
        type: 'email',
        value: true,
        isInitial: false,
      });
      openNotificationWithIcon(
        'success',
        t('common.messages.enabled_successfully')
      );
      setIsTwoFactorAuthenticationUsingEmail(emailCheckBoxValue.target.checked);
    } else {
      setIsDisableTwoFactorEmailModalVisible(true);
    }
  };

  const onTwoFactorAuthenticationUsingApp = (
    appCheckBoxValue: CheckboxChangeEvent
  ) => {
    if (appCheckBoxValue.target.checked) {
      enableDisableTwoFactorAuthentication.mutate({
        type: 'authenticator_app',
        value: true,
        isInitial: false,
      });
      setIsTwoFactorAuthenticationUsingApp(appCheckBoxValue.target.checked);
    } else {
      if (
        profile.data &&
        profile.data.isMfa &&
        profile.data.isMfaEnable &&
        profile.data.isMfaAuthApp &&
        profile.data.recoveryKey &&
        profile.data.isRecoveryKeyGenerated
      ) {
        setIsDisableTwoFactorAuthenticationUsingAppModalVisible(true);
      } else {
        validateQrForm.resetFields();
        enableDisableTwoFactorAuthentication.mutate({
          type: 'authenticator_app',
          value: false,
          isInitial: false,
        });
      }
    }
  };

  const onDisableMfa = async () => {
    if (
      isDisableTwoFactorModalVisible ||
      isDisableTwoFactorEmailModalVisible ||
      isDisableTwoFactorAuthenticationUsingAppModalVisible
    ) {
      const values = await form.validateFields();

      verifyPasswordTwoFactorAuthentication.mutate({
        password: CryptoJS.AES.encrypt(
          values.password,
          PASSWORD_CIPHER_MESSAGE
        ).toString(),
      });
    }
  };

  const onIHaveCopiedClick = () => {
    enableDisableTwoFactorAuthentication.mutate({
      type: 'recovery_key',
      value: true,
      isInitial: false,
    });
    openNotificationWithIcon(
      'success',
      t('common.messages.enabled_successfully')
    );
  };

  const onVerify = async () => {
    const { code } = await validateQrForm.validateFields();
    if (code.trim().length === 0) {
      validateQrForm.setFields([
        {
          name: 'code',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (code.trim().length > 6) {
      validateQrForm.setFields([
        {
          name: 'code',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.code'),
            }),
          ],
        },
      ]);
    } else if (code.trim().length < 6) {
      validateQrForm.setFields([
        {
          name: 'code',
          errors: [t('common.messages.code_minimum_length')],
        },
      ]);
    } else if (
      code !== undefined &&
      code !== null &&
      code.trim().length > 0 &&
      !NUMBER_REGEX_PATTERN.test(code)
    ) {
      validateQrForm.setFields([
        {
          name: 'code',
          errors: [
            t('common.messages.format', {
              entity: t('common.labels.code'),
            }),
          ],
        },
      ]);
    } else {
      verifyAuthCode.mutate({ authAppCode: code });
    }
  };

  const onReCreateEmergencyRecoveryKey = () => {
    setIsCreateNewRecoveryKeyModalVisible(true);
  };

  const onHideGenerateNewKeyModal = () => {
    setIsCreateNewRecoveryKeyModalVisible(false);
  };

  const onCreateNewRecoveryKey = () => {
    generateRecoveryCode.mutate();
  };

  const onPreferenceChange = (preference: string) => {
    setSelectedFirstPreference(preference);
    setIsPreferenceUpdated(true);
    enableDisableTwoFactorAuthentication.mutate({
      type: 'preference',
      value: preference,
      isInitial: false,
    });
  };

  useEffect(() => {
    if (
      generateRecoveryCode.isSuccess &&
      generateRecoveryCode.data.length === 24
    ) {
      enableDisableTwoFactorAuthentication.mutate({
        type: 'recovery_key',
        value: false,
        isInitial: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateRecoveryCode.isSuccess, generateRecoveryCode.data]);

  const onHideDisableTwoFactor = () => {
    if (isDisableTwoFactorModalVisible) {
      form.resetFields();
      setIsDisableTwoFactorModalVisible(false);
    }
    if (isDisableTwoFactorEmailModalVisible) {
      form.resetFields();
      setIsDisableTwoFactorEmailModalVisible(false);
    }
    if (isDisableTwoFactorAuthenticationUsingAppModalVisible) {
      form.resetFields();
      setIsDisableTwoFactorAuthenticationUsingAppModalVisible(false);
      setIsGenerateQrCode(true);
    }
  };

  useEffect(() => {
    if (enableDisableTwoFactorAuthentication.isSuccess) {
      if (isDisableTwoFactorModalVisible) {
        openNotificationWithIcon(
          'success',
          t('common.messages.two_factor_authentication_disabled_successfully')
        );
        form.resetFields();
        setIsDisableTwoFactorModalVisible(false);
      }
      if (isDisableTwoFactorEmailModalVisible) {
        openNotificationWithIcon(
          'success',
          t('common.messages.disabled_successfully')
        );
        form.resetFields();
        setIsDisableTwoFactorEmailModalVisible(false);
      }
      if (isDisableTwoFactorAuthenticationUsingAppModalVisible) {
        openNotificationWithIcon(
          'success',
          t('common.messages.disabled_successfully')
        );
        form.resetFields();
        setIsDisableTwoFactorAuthenticationUsingAppModalVisible(false);
        setIsGenerateQrCode(false);
      }
      if (isCreateNewRecoveryKeyModalVisible) {
        setIsCreateNewRecoveryKeyModalVisible(false);
      }
      if (isPreferenceUpdated) {
        openNotificationWithIcon(
          'success',
          t('common.messages.updated_successfully')
        );
        setIsPreferenceUpdated(false);
      }

      profile.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableDisableTwoFactorAuthentication.isSuccess]);

  useEffect(() => {
    if (profile.isSuccess && profile.data) {
      setIsTwoFactorEnableDisableSwitch(profile.data.isMfaEnable);
      setIsTwoFactorAuthenticationUsingEmail(profile.data.isMfaMail);
      setIsTwoFactorAuthenticationUsingApp(profile.data.isMfaAuthApp);

      if (
        profile.data.isMfaAuthApp &&
        profile.data.isMfa &&
        !profile.data.recoveryKey
      ) {
        setIsGenerateQrCode(true);
      }

      if (profile.data && profile.data.mfaPreference) {
        setSelectedFirstPreference(profile.data.mfaPreference);
      } else {
        setSelectedFirstPreference(PREFERENCES[0].key);
      }
    }
  }, [profile.isSuccess, profile.data]);

  useEffect(() => {
    if (verifyPasswordTwoFactorAuthentication.isSuccess) {
      if (isDisableTwoFactorModalVisible) {
        enableDisableTwoFactorAuthentication.mutate({
          type: 'mfa_enable',
          value: false,
          isInitial: false,
        });
      }
      if (isDisableTwoFactorEmailModalVisible) {
        enableDisableTwoFactorAuthentication.mutate({
          type: 'email',
          value: false,
          isInitial: false,
        });
      }
      if (isDisableTwoFactorAuthenticationUsingAppModalVisible) {
        validateQrForm.resetFields();
        enableDisableTwoFactorAuthentication.mutate({
          type: 'authenticator_app',
          value: false,
          isInitial: false,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifyPasswordTwoFactorAuthentication.isSuccess]);

  useEffect(() => {
    if (verifyAuthCode.isSuccess) {
      if (verifyAuthCode.data === false) {
        openNotificationWithIcon(
          'error',
          t('common.messages.verification_code_is_improper')
        );
      } else {
        profile.refetch();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifyAuthCode.isSuccess, t]);

  return {
    t,
    profile,
    onTwoFactorAuthenticationEnable,
    isTwoFactorEnableDisableSwitch,
    onTwoFactorAuthenticationSwitchChange,
    onTwoFactorAuthenticationUsingEmail,
    onTwoFactorAuthenticationUsingApp,
    generateQrTwoFactorAuthentication,
    onVerify,
    validateQrForm,
    form,
    onIHaveCopiedClick,
    onReCreateEmergencyRecoveryKey,
    selectedFirstPreference,
    onPreferenceChange,
    isDisableTwoFactorModalVisible,
    isDisableTwoFactorEmailModalVisible,
    isDisableTwoFactorAuthenticationUsingAppModalVisible,
    onDisableMfa,
    isTwoFactorAuthenticationUsingEmail,
    isTwoFactorAuthenticationUsingApp,
    isCreateNewRecoveryKeyModalVisible,
    onHideGenerateNewKeyModal,
    onCreateNewRecoveryKey,
    onHideDisableTwoFactor,
  };
};

export default useTwoFactorAuthenticationSecurityController;
