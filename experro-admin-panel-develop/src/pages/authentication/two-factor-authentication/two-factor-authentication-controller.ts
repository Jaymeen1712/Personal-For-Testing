import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { Form } from 'antd';
import Cookies from 'js-cookie';

import useError from '../../../hooks/error';
import {
  API_QUERY_KEY,
  NUMBER_REGEX_PATTERN,
  openNotificationWithIcon,
  PERMISSIONS,
  removeCookies,
  USER_ACCESS_KEY,
} from '../../../utills';
import queryClient from '../../../query-client';
import {
  useGetPermissions,
  useProfile,
  useResendEmailCodeTwoFactorAuthentication,
  useValidateAuthAppCodeTwoFactorAuthentication,
  useValidateEmailCodeTwoFactorAuthentication,
  useValidateRecoveryKeyTwoFactorAuthentication,
  useWorkspaces,
} from './services';

interface ITwoFactorAuthentication {
  type: string;
  preference: string;
}

const useTwoFactorAuthenticationController = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [twoFactorUsingEmail] = Form.useForm();
  const [twoFactorAuthenticationUsingAuthApp] = Form.useForm();
  const { type, preference } = useParams<ITwoFactorAuthentication>();

  const [isResendInvitationCode, setIsResendInvitationCode] =
    useState<boolean>(false);
  const [sendInitialMail, setSendInitialMail] = useState<boolean>(false);
  const [isRecoveryKeyVisible, setIsRecoveryKeyVisible] =
    useState<boolean>(false);
  const [selectedPreference, setSelectedPreference] = useState<string>('');

  const validateEmailCodeTwoFactorAuthentication =
    useValidateEmailCodeTwoFactorAuthentication();
  const validateAuthAppCodeTwoFactorAuthentication =
    useValidateAuthAppCodeTwoFactorAuthentication();
  const validateRecoveryKeyTwoFactorAuthentication =
    useValidateRecoveryKeyTwoFactorAuthentication();
  const resendEmailCodeTwoFactorAuthentication =
    useResendEmailCodeTwoFactorAuthentication(
      isResendInvitationCode,
      sendInitialMail
    );
  const profile = useProfile();
  const workspaces = useWorkspaces();

  const match = useRouteMatch<{ workspaceId?: string }>(
    '/workspaces/:workspaceId'
  );

  const workspaceId =
    workspaces.data &&
    workspaces.data.length > 0 &&
    !profile.data?.hasGlobalRole
      ? workspaces.data[0].id
      : '';

  const permissions = useGetPermissions(
    match?.params?.workspaceId || workspaceId,
    !(profile.isSuccess && workspaces.isSuccess)
  );

  useError({
    mutation: validateEmailCodeTwoFactorAuthentication,
    entity: t('common.labels.auth_code'),
  });

  useError({
    mutation: validateAuthAppCodeTwoFactorAuthentication,
    entity: t('common.labels.auth_code'),
  });

  useError({
    mutation: validateRecoveryKeyTwoFactorAuthentication,
    entity: t('common.labels.recovery_key'),
  });

  useEffect(() => {
    if (type === 'authenticateUsingBoth') {
      setSelectedPreference(preference);
    }
  }, [type, preference]);

  const onResendCode = () => {
    setIsResendInvitationCode(true);
    setSendInitialMail(false);
    resendEmailCodeTwoFactorAuthentication.refetch();
  };

  useEffect(() => {
    if (
      resendEmailCodeTwoFactorAuthentication.isSuccess &&
      isResendInvitationCode &&
      !sendInitialMail
    ) {
      setIsResendInvitationCode(false);
      setSendInitialMail(false);
      openNotificationWithIcon(
        'success',
        t('common.messages.code_resend_successfully')
      );
    }
    if (
      resendEmailCodeTwoFactorAuthentication.isSuccess &&
      isResendInvitationCode &&
      sendInitialMail
    ) {
      setIsResendInvitationCode(false);
      setSendInitialMail(false);
    }
  }, [
    t,
    sendInitialMail,
    resendEmailCodeTwoFactorAuthentication.isSuccess,
    isResendInvitationCode,
  ]);

  const onTwoFactorAuthenticationUsingEmail = (value: {
    emailCode: string;
  }) => {
    if (value.emailCode.trim().length === 0) {
      twoFactorUsingEmail.setFields([
        {
          name: 'emailCode',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (value.emailCode.trim().length > 6) {
      twoFactorUsingEmail.setFields([
        {
          name: 'emailCode',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.auth_code'),
            }),
          ],
        },
      ]);
    } else if (value.emailCode.trim().length < 6) {
      twoFactorUsingEmail.setFields([
        {
          name: 'emailCode',
          errors: [t('common.messages.code_minimum_length')],
        },
      ]);
    } else if (
      value.emailCode !== undefined &&
      value.emailCode !== null &&
      value.emailCode.trim().length > 0 &&
      !NUMBER_REGEX_PATTERN.test(value.emailCode)
    ) {
      twoFactorUsingEmail.setFields([
        {
          name: 'emailCode',
          errors: [
            t('common.messages.format', {
              entity: t('common.labels.auth_code'),
            }),
          ],
        },
      ]);
    } else {
      validateEmailCodeTwoFactorAuthentication.mutate(value);
    }
  };

  useEffect(() => {
    if (validateEmailCodeTwoFactorAuthentication.isSuccess) {
      queryClient.refetchQueries([API_QUERY_KEY.PROFILE]);
      queryClient.refetchQueries([API_QUERY_KEY.PERMISSIONS]);
      queryClient.refetchQueries([API_QUERY_KEY.USER_WORKSPACES]);
    }
  }, [validateEmailCodeTwoFactorAuthentication.isSuccess]);

  const onTwoFactorAuthenticationUsingApp = (value: {
    authAppCode?: string;
    recoveryCode?: string;
  }) => {
    if (value.authAppCode) {
      if (value.authAppCode.trim().length === 0) {
        twoFactorAuthenticationUsingAuthApp.setFields([
          {
            name: 'authAppCode',
            errors: [t('common.messages.please_provide')],
          },
        ]);
      } else if (value.authAppCode.trim().length > 6) {
        twoFactorAuthenticationUsingAuthApp.setFields([
          {
            name: 'authAppCode',
            errors: [
              t('common.messages.max_length', {
                entity: t('common.labels.auth_code'),
              }),
            ],
          },
        ]);
      } else if (value.authAppCode.trim().length < 6) {
        twoFactorAuthenticationUsingAuthApp.setFields([
          {
            name: 'authAppCode',
            errors: [t('common.messages.code_minimum_length')],
          },
        ]);
      } else if (
        value.authAppCode !== undefined &&
        value.authAppCode !== null &&
        value.authAppCode.trim().length > 0 &&
        !NUMBER_REGEX_PATTERN.test(value.authAppCode)
      ) {
        twoFactorAuthenticationUsingAuthApp.setFields([
          {
            name: 'authAppCode',
            errors: [
              t('common.messages.format', {
                entity: t('common.labels.auth_code'),
              }),
            ],
          },
        ]);
      } else {
        validateAuthAppCodeTwoFactorAuthentication.mutate(value);
      }
    } else {
      if (value.recoveryCode && value.recoveryCode.trim().length === 0) {
        twoFactorAuthenticationUsingAuthApp.setFields([
          {
            name: 'recoveryCode',
            errors: [t('common.messages.please_provide')],
          },
        ]);
      } else if (
        value.recoveryCode &&
        value.recoveryCode.split(' ').join('').length > 24
      ) {
        twoFactorAuthenticationUsingAuthApp.setFields([
          {
            name: 'recoveryCode',
            errors: [
              t('common.messages.max_length', {
                entity: t('common.labels.recovery_key'),
              }),
            ],
          },
        ]);
      } else if (
        value.recoveryCode &&
        value.recoveryCode.split(' ').join('').length < 24
      ) {
        twoFactorAuthenticationUsingAuthApp.setFields([
          {
            name: 'recoveryCode',
            errors: [t('common.messages.recovery_key_min_length')],
          },
        ]);
      } else {
        value.recoveryCode = value.recoveryCode?.split(' ').join('');

        validateRecoveryKeyTwoFactorAuthentication.mutate(value);
      }
    }
  };

  useEffect(() => {
    if (validateRecoveryKeyTwoFactorAuthentication.isSuccess) {
      queryClient.refetchQueries([API_QUERY_KEY.PROFILE]);
      queryClient.refetchQueries([API_QUERY_KEY.PERMISSIONS]);
      queryClient.refetchQueries([API_QUERY_KEY.USER_WORKSPACES]);
    }
  }, [validateRecoveryKeyTwoFactorAuthentication.isSuccess]);

  useEffect(() => {
    if (validateAuthAppCodeTwoFactorAuthentication.isSuccess) {
      if (!validateAuthAppCodeTwoFactorAuthentication.data) {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_auth_app_code')
        );
      } else {
        queryClient.refetchQueries([API_QUERY_KEY.PROFILE]);
        queryClient.refetchQueries([API_QUERY_KEY.PERMISSIONS]);
        queryClient.refetchQueries([API_QUERY_KEY.USER_WORKSPACES]);
      }
    }
  }, [
    validateAuthAppCodeTwoFactorAuthentication.isSuccess,
    t,
    validateAuthAppCodeTwoFactorAuthentication.data,
  ]);

  useEffect(() => {
    if (
      permissions.data &&
      workspaces.data &&
      Cookies.get(USER_ACCESS_KEY.TOKEN) &&
      (validateRecoveryKeyTwoFactorAuthentication.isSuccess ||
        validateAuthAppCodeTwoFactorAuthentication.isSuccess ||
        validateEmailCodeTwoFactorAuthentication.isSuccess)
    ) {
      const permissionList = permissions.data.item;

      if (profile.data?.workspaceId && workspaces.data.length > 0) {
        if (workspaces.data?.length > 0) {
          const workspaceData = workspaces.data?.find(
            (item) => item.id === profile.data?.workspaceId
          );
          if (workspaceData) {
            localStorage.removeItem('isTwoFactorAuthentication');
            history.push(
              `/workspaces/${profile.data?.workspaceId}/dashboard/traffic`
            );
          } else {
            localStorage.removeItem('isTwoFactorAuthentication');
            history.push(
              `/workspaces/${workspaces.data[0].id}/dashboard/traffic`
            );
          }
        }
      } else if (permissionList[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']]) {
        localStorage.removeItem('isTwoFactorAuthentication');
        history.push('/workspaces');
      } else if (
        permissionList[PERMISSIONS['GLOBAL.CAN_MANAGE_USER_AND_SECURITY']]
      ) {
        localStorage.removeItem('isTwoFactorAuthentication');
        history.push('/users');
      } else if (
        workspaces.data.length === 0 &&
        !permissionList[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']] &&
        !permissionList[PERMISSIONS['GLOBAL.CAN_MANAGE_USER_AND_SECURITY']]
      ) {
        localStorage.removeItem('isTwoFactorAuthentication');
        history.push('/not-access');
      } else {
        localStorage.removeItem('isTwoFactorAuthentication');
        const workspace = workspaces.data[0];
        if (workspaces.data.length > 0) {
          history.push('/workspaces');
        } else {
          history.push(`/workspaces/${workspace.id}/dashboard/traffic`);
        }
      }
    }
  }, [
    history,
    permissions.data,
    workspaces.data,
    profile.data?.workspaceId,
    validateRecoveryKeyTwoFactorAuthentication.isSuccess,
    validateAuthAppCodeTwoFactorAuthentication.isSuccess,
    validateEmailCodeTwoFactorAuthentication.isSuccess,
  ]);

  const onRedirectToLogin = () => {
    Cookies.remove(USER_ACCESS_KEY.TOKEN);
    Cookies.remove(USER_ACCESS_KEY.TENANT_ID);
    Cookies.remove(USER_ACCESS_KEY.STORE_LINK);
    Cookies.remove('pageEditorPopUp');
    localStorage.clear();
    localStorage.removeItem('environmentId');
    removeCookies();
    history.push('/login');
  };

  const onGoBack = () => {
    twoFactorAuthenticationUsingAuthApp.resetFields();
    setIsRecoveryKeyVisible(false);
  };

  const onAuthenticateUsingRecoverykey = () => {
    twoFactorAuthenticationUsingAuthApp.resetFields();
    setIsRecoveryKeyVisible(true);
  };

  const onSwitchToAuthAppAuthentication = () => {
    setSelectedPreference('authenticator_app');
    twoFactorAuthenticationUsingAuthApp.resetFields();
  };

  const onSwitchToAuthEmailAuthentication = () => {
    setSelectedPreference('email');
    setIsRecoveryKeyVisible(false);
    setIsResendInvitationCode(true);
    setSendInitialMail(true);
    twoFactorUsingEmail.resetFields();
  };

  return {
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
  };
};

export default useTwoFactorAuthenticationController;
