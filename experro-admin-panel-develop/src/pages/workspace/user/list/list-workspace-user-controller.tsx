import { useTranslation } from 'react-i18next';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useHistory, useParams } from 'react-router-dom';

import {
  DebouncedFunc,
  GridParams,
  IWorkspaceParams,
  RowRecord,
} from '../../../../types';
import {
  API_QUERY_KEY,
  APIS_ROUTES,
  openNotificationWithIcon,
  PAGE_SIZE,
  SIDEBAR_KEYS,
} from '../../../../utills';
import queryClient from '../../../../query-client';
import useEnums from '../../../../hooks/enums';
import useError from '../../../../hooks/error';
import useWorkspaceRoute from '../../../../hooks/workspace-route';
import usePermissions from '../../../../hooks/permissions/permissions';
import {
  useDeleteWorkspaceUser,
  useWorkspaceResendInvitation,
  useWorkspaceUserResetPassword,
} from '../services';
import useListWorkspaceUsers from '../services/list';
import { Button, Dropdown, Menu, Tag } from 'antd';
import EllipsisIcon from '../../../../images/icons/ellipsis-icon';
import debounce from 'lodash.debounce';
import useListWorkspaceRole from '../../role/services/workspace-role';

export interface IUser {
  id: string;
  firstName: string;
  email: string;
  status: string;
  roles: {
    id: string;
    name: string;
  }[];
  workspaces: {
    id: string;
    name: string;
    storeLink: string;
  }[];
}

interface IUseListWorkspaceUserController {
  onMainSidebarActiveItem?: (val: string) => void;
}

let changeFn: DebouncedFunc<() => void> | null = null;
const useListWorkspaceUserController = ({
  onMainSidebarActiveItem,
}: IUseListWorkspaceUserController) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const { push } = useWorkspaceRoute();
  const history = useHistory();
  const { USER_STATUS_LIST } = useEnums();

  const [filter, setFilter] = useState('');
  const [selectedFilterRole, setSelectedFilterRole] = useState('any');
  const [status, setStatus] = useState('any');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
    useState(false);
  const [user, setUser] = useState<IUser>();

  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [page, setPage] = useState(1);

  const listWorkspaceUsers = useListWorkspaceUsers(
    workspaceId,
    filter,
    status,
    selectedFilterRole
  );

  const listWorkspaceRolesRes = useListWorkspaceRole(workspaceId);

  const deleteUser = useDeleteWorkspaceUser(workspaceId);
  const permissions = usePermissions();
  const resetPassword = useWorkspaceUserResetPassword(workspaceId);
  const resendInvitation = useWorkspaceResendInvitation(workspaceId);

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

  const params = useMemo(() => {
    const params: GridParams = {};

    if (filter) {
      params.search = filter;
    }
    if (status !== 'any') {
      params.status = status;
    }
    if (selectedFilterRole !== 'any') {
      params.roleId = selectedFilterRole;
    }
    params.fields = 'first_name,last_name,email,status,is_blocked';
    return params;
  }, [filter, status, selectedFilterRole]);

  const onAddUserClick = () => {
    push('/users/add');
  };

  const onEditClick = useCallback(
    (userId: string, user?: RowRecord) => {
      if (user?.status === 'inactive' || user?.status === 'invited') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_user_update', { status: user.status })
        );
      } else {
        if (permissions.canManageGlobalUserAndSecurity()) {
          history.push(`/users/${userId}`);
        } else {
          push(`/users/${userId}`);
        }
      }
    },
    [push, t, history, permissions]
  );

  const onResetPasswordClick = useCallback(
    (userId: string, user?: RowRecord) => {
      if (user?.status === 'inactive') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_user_reset_password', {
            status: user.status,
          })
        );
      } else {
        if (user?.status === 'invited') {
          resendInvitation.mutate(user.id);
        } else {
          setUser(user as unknown as IUser);
          setIsResetPasswordModalVisible(true);
        }
      }
    },
    [resendInvitation, t]
  );

  const onDeleteClick = useCallback(
    (userId: string, user?: RowRecord) => {
      if (user?.status === 'inactive') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_user_delete', { status: user.status })
        );
      } else {
        setUser(user as unknown as IUser);
        setIsDeleteModalVisible(true);
      }
    },
    [t]
  );

  const onResetPasswordSubmit = useCallback(() => {
    if (user) {
      resetPassword.mutate(user.id);
    }
  }, [user, resetPassword]);

  const onDeleteModalSubmit = useCallback(() => {
    if (user) {
      deleteUser.mutate(user.id);
    }
  }, [user, deleteUser]);

  const hideDeleteModal = useCallback(() => {
    setIsDeleteModalVisible(false);
  }, []);

  const hideResetPasswordModal = useCallback(() => {
    setIsResetPasswordModalVisible(false);
  }, []);

  const pagination = useMemo(
    () => ({
      total: listWorkspaceUsers?.data?.totalCount,
      pageSize: pageSize,
      showSizeChanger: true,
      current: page,
      hideOnSinglePage: !!(
        listWorkspaceUsers.data &&
        listWorkspaceUsers.data.totalCount &&
        listWorkspaceUsers.data.totalCount < PAGE_SIZE
      ),
      pageSizeOptions: [5, 10, 20, 50, 100],
      locale: { items_per_page: ' per page' },
      onChange: (page: number, pageSize: number) => {
        setPageSize(pageSize);
        setPage(page);
        listWorkspaceUsers.remove();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listWorkspaceUsers.data, page, pageSize]
  );

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.name'),
        dataIndex: 'name',
        key: 'name',
        width: '25%',
        render: (name: string, record: RowRecord) => {
          if (record) {
            return (
              <>
                <div className="ant-row ant-space-align-center ant-row-space-between w-100 table-text-button">
                  <div
                    onClick={
                      (permissions.canUpdateUser() &&
                        permissions.canReadUser()) ||
                      permissions.canManageGlobalUserAndSecurity()
                        ? () => onEditClick(record.id, record)
                        : (e) => e.stopPropagation()
                    }
                    className={`${
                      (permissions.canUpdateUser() &&
                        permissions.canReadUser()) ||
                      permissions.canManageGlobalUserAndSecurity()
                        ? 'text-blue cursor-pointer'
                        : ''
                    } text-truncate`}>
                    {record.firstName} {record.lastName}
                  </div>
                  {((permissions.canReadUser() &&
                    (permissions.canUpdateUser() ||
                      permissions.canDeleteUser())) ||
                    permissions.canManageGlobalUserAndSecurity()) && (
                    <Dropdown
                      placement="bottomRight"
                      trigger={['click']}
                      overlay={
                        <div className="table-dropdown">
                          <Menu>
                            {(permissions.canUpdateUser() ||
                              permissions.canManageGlobalUserAndSecurity()) && (
                              <Menu.Item
                                onClick={() => onEditClick(record.id, record)}>
                                {t('common.labels.edit')}
                              </Menu.Item>
                            )}

                            {(permissions.canUpdateUser() ||
                              permissions.canManageGlobalUserAndSecurity()) && (
                              <Menu.Item
                                onClick={() =>
                                  onResetPasswordClick(record.id, record)
                                }>
                                {record.status === 'invited'
                                  ? t('common.labels.resend_link')
                                  : t('common.labels.reset_password')}
                              </Menu.Item>
                            )}

                            {permissions.canDeleteUser() && (
                              <Menu.Item
                                onClick={() =>
                                  onDeleteClick(record.id, record)
                                }>
                                <p className="text-red m-0">
                                  {t('common.labels.remove')}
                                </p>
                              </Menu.Item>
                            )}
                          </Menu>
                        </div>
                      }>
                      <Button
                        type="text"
                        size="small"
                        className="on-hover"
                        icon={<EllipsisIcon />}
                        style={{ float: 'right' }}
                      />
                    </Dropdown>
                  )}
                </div>
              </>
            );
          }
        },
      },
      {
        title: t('common.labels.email'),
        dataIndex: 'email',
        key: 'email',
        width: '20%',
      },
      {
        title: t('common.labels.roles'),
        dataIndex: 'roles',
        key: 'roles',
        width: '35%',
        render: (roles: string[], record: RowRecord) => {
          if (record) {
            return `${(record as unknown as IUser).roles
              .reduce((result, role) => result + role.name + ', ', '')
              .slice(0, -2)}`;
          }
        },
      },
      {
        title: t('common.labels.status'),
        dataIndex: 'status',
        key: 'status',
        width: '20%',
        render: (status: string, record: RowRecord) => {
          if (record.status === 'invited') {
            return <Tag color="blue">{t('common.labels.invited')}</Tag>;
          } else if (record.status === 'active') {
            return <Tag color="success">{t('common.labels.active')}</Tag>;
          } else if (record.status === 'blocked') {
            return <Tag color="error">{t('common.labels.blocked')}</Tag>;
          } else {
            return <Tag color="default">{t('common.labels.inactive')}</Tag>;
          }
        },
      },
    ],
    // eslint-disable-next-line
    [t]
  );

  const userStatusOptions = useMemo(
    () => [{ key: 'any', label: t('common.labels.all') }, ...USER_STATUS_LIST],
    [t, USER_STATUS_LIST]
  );

  const statusLabel = useMemo(
    () =>
      userStatusOptions.find((option) => option.key === status)?.label ||
      status,
    [status, userStatusOptions]
  );

  const userRolesOptions = useMemo(() => {
    const rolesOptions = [{ label: t('common.labels.all'), key: 'any' }];
    if (
      listWorkspaceRolesRes.isSuccess &&
      listWorkspaceRolesRes.data &&
      listWorkspaceRolesRes.data.length
    ) {
      rolesOptions.push(
        ...listWorkspaceRolesRes.data?.map((role) => ({
          key: role.id,
          label: role.name,
        }))
      );
      setSelectedFilterRole(rolesOptions[0].key);
    }
    return rolesOptions;
  }, [t, listWorkspaceRolesRes.isSuccess, listWorkspaceRolesRes.data]);

  const selectedFilterRoleLabel = useMemo(
    () =>
      userRolesOptions.find((option) => option.key === selectedFilterRole)
        ?.label || selectedFilterRole,
    [selectedFilterRole, userRolesOptions]
  );

  useEffect(() => {
    if (deleteUser.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.removed_successfully')
      );
      queryClient.removeQueries(['form-select', APIS_ROUTES.USERS_ALL]);
      queryClient.removeQueries([API_QUERY_KEY.WORKSPACE_ALL_USERS]);
      hideDeleteModal();
    }
  }, [deleteUser.isSuccess, t, hideDeleteModal, workspaceId]);

  useEffect(() => {
    if (resetPassword.isSuccess) {
      openNotificationWithIcon('success', t('common.messages.link_sent'));
      hideResetPasswordModal();
    }
  }, [resetPassword.isSuccess, t, hideResetPasswordModal]);

  useEffect(() => {
    if (resendInvitation.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.resend_link_message')
      );
      hideResetPasswordModal();
    }
  }, [resendInvitation.isSuccess, t, hideResetPasswordModal]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearchFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;

    if (changeFn !== null) {
      changeFn.cancel();
    }

    if (value.length >= 3 || value.length === 0) {
      changeFn = debounce(() => setFilter(value), 500);
      changeFn();
    }
  };

  const onStatusFilterChange = (filterStatus: string) => {
    setStatus(filterStatus);
  };

  const onRoleFilterChange = (filterRole: string) => {
    setSelectedFilterRole(filterRole);
  };

  return {
    t,
    filter,
    setFilter,
    selectedFilterRole,
    status,
    statusLabel,
    selectedFilterRoleLabel,
    setStatus,
    params,
    userStatusOptions,
    userRolesOptions,
    columns,
    onAddUserClick,
    user,
    isDeleteModalVisible,
    hideDeleteModal,
    onDeleteModalSubmit,
    isResetPasswordModalVisible,
    hideResetPasswordModal,
    onResetPasswordSubmit,
    workspaceId,
    canCreateUser: permissions.canCreateUser(),
    deleteUser,
    resetPassword,
    pagination,
    onSearchFilterChange,
    onStatusFilterChange,
    onRoleFilterChange,
    isLoading: listWorkspaceUsers?.isLoading,
    listWorkspaceUsersData: listWorkspaceUsers?.data?.items,
  };
};

export default useListWorkspaceUserController;
