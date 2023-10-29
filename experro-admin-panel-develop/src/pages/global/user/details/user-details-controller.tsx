import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Tag } from 'antd';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import useError from '../../../../hooks/error';
import {
  convertDateTimeToUserTimezone,
  openNotificationWithIcon,
} from '../../../../utills';
import useUser from '../../../../hooks/user';
import usePermissions from '../../../../hooks/permissions';
import {
  useDeleteUser,
  useResendInvitation,
  useResetPassword,
  useResetTwoFactorUser,
  useUserWorkspaces,
} from '../services';

interface IParams {
  userId: string;
}

const UserDetailsController = () => {
  const { t } = useTranslation();
  const { userId } = useParams<IParams>();
  const history = useHistory();

  const user = useUser();
  const detailUser = useUserWorkspaces(userId);
  const deleteUser = useDeleteUser();
  const resetPassword = useResetPassword();
  const resendInvitation = useResendInvitation();
  const permissions = usePermissions();
  const resetTwoFactorUser = useResetTwoFactorUser();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
    useState(false);

  useError({
    mutation: deleteUser,
    entity: t('common.labels.user'),
    cb: () => setIsDeleteModalVisible(false),
  });

  useError({
    mutation: resetPassword,
    entity: t('common.labels.user'),
    cb: () => setIsResetPasswordModalVisible(false),
  });

  useError({
    mutation: resendInvitation,
    entity: t('common.labels.user'),
    cb: () => setIsResetPasswordModalVisible(false),
  });

  const fullName = useMemo(() => {
    if (detailUser.data) {
      const firstName = detailUser.data.firstName;
      const lastName = detailUser.data.lastName;
      return (
        '' +
        firstName?.charAt(0).toUpperCase() +
        firstName?.slice(1) +
        ' ' +
        lastName?.charAt(0).toUpperCase() +
        lastName?.slice(1)
      );
    }
  }, [detailUser.data]);

  const workspaceRoleDetail = useMemo(() => {
    if (detailUser.data) {
      return detailUser.data.workspaces?.map((workspace) => ({
        workspace: workspace.name,
        // @ts-ignore
        roles: workspace.roles.reduce((result, role, index) => {
          if (Array.isArray(result)) {
            if (index === workspace.roles.length - 1) {
              if (
                role.name === 'Workspace Admin' ||
                role.name === 'Super Admin'
              ) {
                return [...result, role.name];
              }
              return [
                ...result,
                <Link
                  to={
                    workspace.id
                      ? `/roles/${role.id}/?editWorkspaceId=${workspace.id}`
                      : `/roles/${role.id}`
                  }>
                  {role.name}
                </Link>,
              ];
            } else {
              if (
                role.name === 'Workspace Admin' ||
                role.name === 'Super Admin'
              ) {
                return [...result, `${role.name}, `];
              }
              return [
                ...result,
                <Link
                  to={
                    workspace.id
                      ? `/roles/${role.id}/?editWorkspaceId=${workspace.id}`
                      : `/roles/${role.id}`
                  }>{`${role.name}, `}</Link>,
              ];
            }
          } else {
            if (index === workspace.roles.length - 1) {
              if (
                role.name === 'Workspace Admin' ||
                role.name === 'Super Admin'
              ) {
                return [role.name];
              }
              return [
                <Link
                  to={
                    workspace.id
                      ? `/roles/${role.id}/?editWorkspaceId=${workspace.id}`
                      : `/roles/${role.id}`
                  }>
                  {role.name}
                </Link>,
              ];
            } else {
              if (
                role.name === 'Workspace Admin' ||
                role.name === 'Super Admin'
              ) {
                return [`${role.name}, `];
              }
              return [
                <Link
                  to={
                    workspace.id
                      ? `/roles/${role.id}/?editWorkspaceId=${workspace.id}`
                      : `/roles/${role.id}`
                  }>{`${role.name}, `}</Link>,
              ];
            }
          }
        }, []),
      }));
    }

    return [];
  }, [detailUser.data]);

  const onResetTwoFactorAuthentication = useCallback(() => {
    resetTwoFactorUser.mutate(userId);
  }, [userId, resetTwoFactorUser]);

  useEffect(() => {
    if (resetTwoFactorUser.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.2fa_reset_successfully')
      );
      detailUser.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTwoFactorUser.isSuccess]);

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.workspaces'),
        dataIndex: 'workspace',
        key: 'workspace',
        width: '15%',
      },
      {
        title: t('common.labels.roles'),
        dataIndex: 'roles',
        key: 'roles',
        width: '35%',
        // className: 'text-blue',
      },
    ],
    [t]
  );

  const accessHistoryColumns = [
    {
      title: t('common.labels.time'),
      dataIndex: 'time',
      key: 'time',
      width: '25%',
    },
    {
      title: t('common.labels.ip'),
      dataIndex: 'ip',
      key: 'ip',
      width: '25%',
    },
    {
      title: t('common.labels.device'),
      dataIndex: 'device',
      key: 'device',
      width: '25%',
    },
    {
      title: t('common.labels.os'),
      dataIndex: 'operatingSystem',
      key: 'operatingSystem',
      width: '25%',
    },
  ];

  const accessHistoryData = [
    {
      key: '1',
      time: 'May 4, 2022  |  12:35:14 AM',
      ip: '43.229.92.208',
      device: 'Browser Safari 14.1.2',
      operatingSystem: 'OS Mac OS 10.15.7',
    },
    {
      key: '2',
      time: 'May 4, 2022  |  12:35:14 AM',
      ip: '43.229.92.208',
      device: 'Browser Safari 14.1.2',
      operatingSystem: 'OS Mac OS 10.15.7',
    },
    {
      key: '3',
      time: 'May 4, 2022  |  12:35:14 AM',
      ip: '43.229.92.208',
      device: 'Browser Safari 14.1.2',
      operatingSystem: 'OS Mac OS 10.15.7',
    },
  ];

  const aboutInfo = useMemo(
    () => [
      {
        key: '1',
        label: t('common.labels.firstName'),
        value: detailUser.data?.firstName,
      },
      {
        key: '2',
        label: t('common.labels.lastName'),
        value: detailUser.data?.lastName,
      },
      {
        key: '3',
        label: t('common.labels.email'),
        value: detailUser.data?.email,
      },
      {
        key: '4',
        label: t('common.labels.registered_on'),
        value: convertDateTimeToUserTimezone(
          moment(detailUser?.data?.createdAt).format(),
          user?.user?.timezone
        ),
      },
      {
        key: '5',
        label: t('common.labels.status'),
        value: (
          <Tag
            color={`${
              detailUser.data?.status === 'invited'
                ? 'blue'
                : detailUser.data?.status === 'active'
                ? 'success'
                : detailUser.data?.status === 'blocked'
                ? 'error'
                : 'default'
            }`}>
            {detailUser.data &&
              detailUser.data.status &&
              detailUser.data?.status?.charAt(0).toUpperCase() +
                detailUser.data?.status?.slice(1)}
          </Tag>
        ),
      },
      {
        key: '6',
        label: t('common.labels.2FA'),
        value: (
          <div className="ant-row ant-row-middle ant-row-space-between">
            <p className="m-0">
              {detailUser.data?.isMfaEnable &&
              detailUser.data.isMfa &&
              detailUser.data.isMfaMail &&
              detailUser.data.isMfaAuthApp &&
              detailUser.data.isRecoveryKeyGenerated &&
              detailUser.data.recoveryKey &&
              detailUser.data.mfaPreference
                ? t('common.labels.email_authenticator_app')
                : detailUser.data?.isMfaEnable &&
                  detailUser.data.isMfa &&
                  detailUser.data.isMfaMail
                ? t('common.labels.email')
                : detailUser.data?.isMfaEnable &&
                  detailUser.data.isMfa &&
                  detailUser.data.isMfaAuthApp &&
                  detailUser.data.isRecoveryKeyGenerated &&
                  detailUser.data.recoveryKey
                ? t('common.labels.authenticator_app')
                : t('common.labels.disable')}
            </p>
            {permissions.canManageGlobalUserAndSecurity() &&
              (detailUser.data?.status === 'active' ||
                detailUser.data?.status === 'blocked') &&
              detailUser.data?.isMfaEnable &&
              detailUser.data.isMfa &&
              (detailUser.data.isMfaMail ||
                (detailUser.data.isMfaAuthApp &&
                  detailUser.data.isRecoveryKeyGenerated &&
                  detailUser.data.recoveryKey)) && (
                <Button
                  type="link"
                  onClick={onResetTwoFactorAuthentication}
                  danger>
                  {t('common.labels.reset')}
                </Button>
              )}
          </div>
        ),
      },
    ],
    [detailUser.data, t, user, onResetTwoFactorAuthentication, permissions]
  );

  const onBackButtonClick = () => {
    history.push('/users');
  };

  const onDeleteClick = () => {
    setIsDeleteModalVisible(true);
  };

  const hideDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };

  const onDeleteModalSubmit = () => {
    deleteUser.mutate(userId);
  };

  const onEditClick = () => {
    if (detailUser.data) {
      if (detailUser.data.status === 'inactive') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_user_update', {
            status: detailUser.data.status,
          })
        );
      } else if (detailUser.data.status === 'invited') {
        openNotificationWithIcon(
          'error',
          t('common.messages.can_not_update_invited_user')
        );
      } else {
        history.push(`/users/${userId}`);
      }
    }
  };

  const onResetPasswordClick = () => {
    if (detailUser.data) {
      if (detailUser.data.status === 'inactive') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_user_reset_password', {
            status: detailUser.data.status,
          })
        );
      } else {
        if (detailUser.data.status === 'invited') {
          resendInvitation.mutate(userId);
        } else {
          setIsResetPasswordModalVisible(true);
        }
      }
    }
  };

  const hideResetPasswordModal = () => {
    setIsResetPasswordModalVisible(false);
  };

  const onResetPasswordSubmit = () => {
    resetPassword.mutate(userId);
  };

  useEffect(() => {
    if (deleteUser.isSuccess) {
      hideDeleteModal();
      openNotificationWithIcon(
        'success',
        t('common.messages.deleted_successfully')
      );
      history.push('/users');
    }
  }, [deleteUser.isSuccess, t, history]);

  useEffect(() => {
    if (resetPassword.isSuccess) {
      openNotificationWithIcon('success', t('common.messages.link_sent'));
      hideResetPasswordModal();
    }
  }, [resetPassword.isSuccess, t]);

  useEffect(() => {
    if (resendInvitation.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.resend_link_message')
      );
      hideResetPasswordModal();
    }
  }, [resendInvitation.isSuccess, t]);

  return {
    columns,
    fullName,
    userId,
    accessHistoryData,
    accessHistoryColumns,
    detailUser,
    workspaceRoleDetail,
    aboutInfo,
    t,
    onBackButtonClick,
    onDeleteClick,
    isDeleteModalVisible,
    deleteUser,
    hideDeleteModal,
    onDeleteModalSubmit,
    onResetPasswordClick,
    onEditClick,
    isResetPasswordModalVisible,
    hideResetPasswordModal,
    onResetPasswordSubmit,
    resetPassword,
  };
};

export default UserDetailsController;
