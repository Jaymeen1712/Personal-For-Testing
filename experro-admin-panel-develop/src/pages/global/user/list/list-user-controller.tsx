import { useTranslation } from 'react-i18next';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Dropdown, message, Tag, Menu, Form, Popover } from 'antd';
import debounce from 'lodash.debounce';

import { openNotificationWithIcon, PAGE_SIZE } from '../../../../utills';
import useEnums from '../../../../hooks/enums';
import useError from '../../../../hooks/error';
import EllipsisIcon from '../../../../images/icons/ellipsis-icon';
import {
  useDeleteUser,
  useResendInvitation,
  useResetPassword,
  useUnblockUser,
  useBlockUser,
  useListUser,
  useAllWorkspaces,
  useAllRoles,
} from '../services';
import useUser from '../../../../hooks/user';
import { IRole, IWorkspace } from '../../../../types';

interface IWorkspaces {
  id: string;
  name: string;
  storeLink: string;
}

interface IGroups {
  globalCount: number;
  id: string;
  name: string;
  roleCount: number;
  workspaceCount: number;
}

interface IRoles {
  id: string;
  name: string;
  workspaceId: string;
  workspaceName: string;
}

interface IListUser {
  id: string;
  firstName: string;
  email: string;
  status: string;
  createdAt: string;
  isBlocked: boolean;
  lastName: string;
  workspaces: IWorkspaces[];
  groups?: IGroups[];
  roles?: IRoles[];
}

const useListUserController = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();

  const [filter, setFilter] = useState('');
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [status, setStatus] = useState('all');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
    useState(false);
  const [isBlockUserModalVisible, setBlockUserModalVisible] = useState(false);
  const [user, setUser] = useState<IListUser>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [listWorkspaces, setListWorkspaces] = useState<
    IWorkspace[] | undefined
  >([]);
  const [workspaceFilterValue, setWorkspaceFilterValue] = useState('');
  const workspaceFilterInputRef = useRef();

  const [listRoles, setListRoles] = useState<IRole[] | undefined>([]);
  const [roleFilterValue, setRoleFilterValue] = useState('');
  const roleFilterInputRef = useRef();

  const deleteUser = useDeleteUser();
  const resetPassword = useResetPassword();
  const resendInvitation = useResendInvitation();
  const unblockUser = useUnblockUser();
  const blockUser = useBlockUser();
  const userData = useUser();
  const listUser = useListUser();
  const allWorkspaces = useAllWorkspaces();
  const allRoles = useAllRoles();

  const { USER_STATUS_LIST } = useEnums();

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

  const onAddUserClick = () => {
    history.push('/users/create');
  };

  const pagination = useMemo(
    () => ({
      total: listUser.data?.totalCount,
      pageSize: pageSize,
      showSizeChanger: true,
      current: page,
      hideOnSinglePage: !!(
        listUser.data &&
        listUser.data.totalCount &&
        listUser.data.totalCount < PAGE_SIZE
      ),
      pageSizeOptions: [5, 10, 20, 50, 100],
      locale: { items_per_page: ' per page' },
      onChange: (pageNumber: number, pageNumberSize: number) => {
        setPageSize(pageNumberSize);
        setPage(pageNumber);
        listUser.mutate({
          page: pageNumber,
          pageSize: pageNumberSize,
          filter: filter,
          status: status,
          workspaces: selectedWorkspaces,
          roles: roles,
        });
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listUser.data, setPage, page, pageSize, setPageSize]
  );

  const onEditClick = useCallback(
    (userId: string, user: IListUser) => {
      if (user.status === 'inactive') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_user_update', { status: user.status })
        );
      } else if (user.status === 'invited') {
        openNotificationWithIcon(
          'error',
          t('common.messages.can_not_update_invited_user')
        );
      } else {
        history.push(`/users/${userId}`);
      }
    },
    [history, t]
  );

  const onResetPasswordClick = useCallback(
    (userId: string, user: IListUser) => {
      if (user.status === 'inactive') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_user_reset_password', {
            status: user.status,
          })
        );
      } else {
        if (user.status === 'invited') {
          resendInvitation.mutate(user.id);
        } else {
          setUser(user);
          setIsResetPasswordModalVisible(true);
        }
      }
    },
    [resendInvitation, t]
  );

  const onDeleteClick = useCallback(
    (userId: string, user: IListUser) => {
      if (user.status === 'inactive') {
        openNotificationWithIcon(
          'error',
          t('common.messages.invalid_user_delete', { status: user.status })
        );
      } else {
        setUser(user);
        setIsDeleteModalVisible(true);
      }
    },
    [t]
  );

  const onResetPasswordSubmit = () => {
    if (user) {
      resetPassword.mutate(user.id);
    }
  };

  const onDeleteModalSubmit = () => {
    if (user) {
      deleteUser.mutate(user.id);
    }
  };

  const hideDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };

  const hideResetPasswordModal = () => {
    setIsResetPasswordModalVisible(false);
  };

  const onUnBlockUser = useCallback(
    (userId: string) => {
      unblockUser.mutate(userId);
    },
    [unblockUser]
  );

  const onBlockUser = (user: IListUser) => {
    setUser(user);
    setBlockUserModalVisible(true);
  };

  const hideBlockUserModal = () => {
    setBlockUserModalVisible(false);
  };

  const onBlockUserClick = () => {
    if (user) {
      blockUser.mutate(user.id);
    }
  };

  const onUserClick = useCallback(
    (id: string) => {
      history.push(`/users/${id}/details`);
    },
    [history]
  );

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.name'),
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        render: (text: string, record: IListUser) => (
          <div
            className={`ant-row ant-row-middle ant-row-no-wrap ant-row-space-between table-text-button`}>
            <div className="table-text">
              <div
                className="text-blue cursor-pointer"
                onClick={() => onUserClick(record.id)}>
                {record.firstName} {record.lastName || ''}
              </div>
            </div>

            <Dropdown
              overlay={
                <div className="table-dropdown">
                  <Menu>
                    <Menu.Item onClick={() => onEditClick(record.id, record)}>
                      {t('common.labels.edit')}
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => onResetPasswordClick(record.id, record)}>
                      {record.status === 'invited'
                        ? t('common.labels.resend_link')
                        : t('common.labels.reset_password')}
                    </Menu.Item>
                    {record.status === 'active' &&
                      userData?.user?.id !== record.id && (
                        <Menu.Item onClick={() => onBlockUser(record)}>
                          {t('common.labels.block_user')}
                        </Menu.Item>
                      )}
                    {record.isBlocked && (
                      <Menu.Item onClick={() => onUnBlockUser(record.id)}>
                        {record.isBlocked && t('common.labels.unBlock_user')}
                      </Menu.Item>
                    )}
                    <Menu.Item
                      className="text-red"
                      onClick={() => onDeleteClick(record.id, record)}>
                      {t('common.labels.delete')}
                    </Menu.Item>
                  </Menu>
                </div>
              }
              placement="bottomRight"
              trigger={['click']}>
              <Button
                type="text"
                size="small"
                className="on-hover"
                icon={<EllipsisIcon />}
                style={{ float: 'right' }}
              />
            </Dropdown>
          </div>
        ),
      },
      {
        title: t('common.labels.email'),
        dataIndex: 'email',
        key: 'email',
        width: '20%',
      },
      {
        title: t('common.labels.workspace'),
        dataIndex: 'workspaces',
        key: 'workspace',
        width: '25%',
        render: (workspaces: IWorkspaces[], record: IListUser) => (
          <div className="table-text">
            <div>
              {record.workspaces.length > 1
                ? record.workspaces[0].name +
                  `, +${record.workspaces.length - 1}`
                : record.workspaces.length > 0
                ? record.workspaces[0].name
                : '-'}
            </div>
          </div>
        ),
      },
      {
        title: t('common.labels.roles'),
        dataIndex: 'rolesCount',
        key: 'roles',
        width: '10%',
        render: (rolesCount: number, record: IListUser) => (
          <div className="table-text">
            <div>
              {record.roles ? (
                record.roles.length !== 0 ? (
                  <div className="cursor-pointer">
                    <Popover
                      placement="bottomRight"
                      content={record.roles.map((role) => (
                        <p key={role.id} className="group-users">
                          <strong>{role.name}</strong>
                          {role.workspaceName}
                        </p>
                      ))}>
                      {`${
                        record.roles.length > 1
                          ? `${record.roles.length} Roles`
                          : `${record.roles.length} Role`
                      }`}
                    </Popover>
                  </div>
                ) : (
                  '-'
                )
              ) : (
                `-`
              )}
            </div>
          </div>
        ),
      },
      {
        title: t('common.labels.groups'),
        dataIndex: 'groupsCount',
        key: 'groups',
        width: '10%',
        render: (groupCount: number, record: IListUser) => (
          <div className="table-text">
            <div>
              {record.groups ? (
                record.groups.length !== 0 ? (
                  <div className="cursor-pointer">
                    <Popover
                      placement="bottomRight"
                      content={record.groups.map((role) => (
                        <p key={role.id} className="group-users">
                          <strong>{role.name}</strong>
                          {role.roleCount > 0 &&
                          role.workspaceCount > 0 &&
                          role.globalCount > 0
                            ? t('common.labels.role_workspace_and_global', {
                                roles: role.roleCount,
                                workspace: role.workspaceCount,
                              })
                            : role.roleCount > 0 && role.workspaceCount > 0
                            ? t('common.labels.role_and_workspace_count', {
                                roles: role.roleCount,
                                workspace: role.workspaceCount,
                              })
                            : role.roleCount > 0 && role.globalCount > 0
                            ? t('common.labels.role_in_global', {
                                roles: role.roleCount,
                              })
                            : '-'}
                        </p>
                      ))}>
                      {`${
                        record.groups.length > 1
                          ? `${record.groups.length} Groups`
                          : `${record.groups.length} Group`
                      }`}
                    </Popover>
                  </div>
                ) : (
                  '-'
                )
              ) : (
                `-`
              )}
            </div>
          </div>
        ),
      },
      {
        title: t('common.labels.status'),
        dataIndex: 'status',
        key: 'status',
        width: '15%',
        // rendererType: GRID_RENDERER_TYPE.TAG,
        // rendererProps: statusOptions,
        render: (status: string, record: IListUser) => (
          <>
            {/*@ts-ignore*/}
            <Tag
              color={
                record.status === 'invited'
                  ? 'blue'
                  : record.status === 'active'
                  ? 'success'
                  : record.status === 'blocked'
                  ? 'error'
                  : 'default'
              }>
              {/*@ts-ignore*/}
              {record.status === 'active'
                ? t('common.labels.active')
                : record.status === 'invited'
                ? t('common.labels.invited')
                : record.status === 'inactive'
                ? t('common.labels.inactive')
                : t('common.labels.blocked')}
            </Tag>
          </>
        ),
      },
    ],
    [
      t,
      onEditClick,
      onDeleteClick,
      onUnBlockUser,
      onResetPasswordClick,
      onUserClick,
      userData?.user?.id,
    ]
  );

  const userStatusOptions = useMemo(
    () => [{ key: 'all', label: t('common.labels.all') }, ...USER_STATUS_LIST],
    [t, USER_STATUS_LIST]
  );

  useEffect(() => {
    if (deleteUser.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.user_deleted_successfully')
      );

      if (page > 1) {
        setPage(1);
      }

      listUser.mutate({
        page: page > 1 ? 1 : page,
        pageSize: pageSize,
        status: status,
        filter: filter,
        roles: roles,
        workspaces: selectedWorkspaces,
      });
      hideDeleteModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteUser.isSuccess, t]);

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

  useEffect(() => {
    if (unblockUser.isSuccess) {
      message.success(t('common.messages.user_unblocked_successfully'));

      if (page > 1) {
        setPage(1);
      }

      listUser.mutate({
        page: page > 1 ? 1 : page,
        pageSize: pageSize,
        status: status,
        filter: filter,
        roles: roles,
        workspaces: selectedWorkspaces,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unblockUser.isSuccess, t]);

  useEffect(() => {
    if (blockUser.isSuccess) {
      hideBlockUserModal();
      message.success(t('common.messages.user_blocked_successfully'));

      if (page > 1) {
        setPage(1);
      }

      listUser.mutate({
        page: page > 1 ? 1 : page,
        pageSize: pageSize,
        status: status,
        filter: filter,
        roles: roles,
        workspaces: selectedWorkspaces,
      });
    }
    // eslint-disable-next-line
  }, [blockUser.isSuccess]);

  useEffect(() => {
    form.resetFields();
    listUser.mutate({
      page: page,
      pageSize: pageSize,
      status: status,
      filter: filter,
      roles: roles,
      workspaces: selectedWorkspaces,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onWorkspaceChange = (workspaceIds: string[]) => {
    if (workspaceIds.length > 1 && workspaceIds.indexOf('All') !== -1) {
      workspaceIds.splice(workspaceIds.indexOf('All'), 1);
    }

    if (page > 1) {
      setPage(1);
    }
    setSelectedWorkspaces(workspaceIds);
    setWorkspaceFilterValue('');
    setListWorkspaces(allWorkspaces.data);
    //@ts-ignore
    workspaceFilterInputRef?.current?.blur();
    listUser.mutate({
      page: page > 1 ? 1 : page,
      pageSize: pageSize,
      filter: filter,
      status: status,
      workspaces: workspaceIds,
      roles: roles,
    });
  };

  const onStatusChange = (selectedStatus: string) => {
    if (page > 1) {
      setPage(1);
    }

    setStatus(selectedStatus);

    listUser.mutate({
      page: page > 1 ? 1 : page,
      pageSize: pageSize,
      filter: filter,
      status: selectedStatus,
      workspaces: selectedWorkspaces,
      roles: roles,
    });
  };

  const onRoleChange = (selectedRoles: string[]) => {
    if (selectedRoles.length > 1 && selectedRoles.indexOf('All') !== -1) {
      selectedRoles.splice(selectedRoles.indexOf('All'), 1);
    }

    if (page > 1) {
      setPage(1);
    }
    setRoles(selectedRoles);
    setRoleFilterValue('');
    setListRoles(allRoles.data);
    //@ts-ignore
    roleFilterInputRef?.current?.blur();
    listUser.mutate({
      page: page > 1 ? 1 : page,
      pageSize: pageSize,
      filter: filter,
      status: status,
      workspaces: selectedWorkspaces,
      roles: selectedRoles,
    });
  };

  const onInputChange = debounce((searchValue) => {
    setFilter(searchValue);

    if (page > 1) {
      setPage(1);
    }

    listUser.mutate({
      page: page > 1 ? 1 : page,
      pageSize: pageSize,
      filter: searchValue,
      status: status,
      workspaces: selectedWorkspaces,
      roles: roles,
    });
  }, 1000);

  useEffect(() => {
    if (
      allWorkspaces.isSuccess &&
      allWorkspaces.data &&
      allWorkspaces.data.length > 0
    ) {
      setListWorkspaces([...allWorkspaces.data]);
    }
  }, [allWorkspaces.isSuccess, allWorkspaces.data]);

  const onWorkspaceFilterInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (allWorkspaces.data) {
      if (e.target.value.length > 0) {
        setListWorkspaces(
          allWorkspaces.data.filter((item) =>
            item.name.toLowerCase().includes(e.target.value.toLowerCase())
          )
        );
      } else {
        setListWorkspaces(allWorkspaces.data);
      }
      setWorkspaceFilterValue(e.target.value);
    }
  };

  useEffect(() => {
    if (allRoles.isSuccess && allRoles.data && allRoles.data.length > 0) {
      setListRoles([...allRoles.data]);
    }
  }, [allRoles.isSuccess, allRoles.data]);

  const onRoleFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (allRoles.data) {
      if (e.target.value.length > 0) {
        setListRoles(
          allRoles.data.filter(
            (item) =>
              item.name?.toLowerCase().includes(e.target.value.toLowerCase()) ||
              item.workspaceName
                ?.toLowerCase()
                .includes(e.target.value.toLowerCase())
          )
        );
      } else {
        setListRoles(allRoles.data);
      }
      setRoleFilterValue(e.target.value);
    }
  };

  return {
    t,
    selectedWorkspaces,
    status,
    userStatusOptions,
    columns,
    onAddUserClick,
    user,
    isDeleteModalVisible,
    hideDeleteModal,
    onDeleteModalSubmit,
    isBlockUserModalVisible,
    isResetPasswordModalVisible,
    hideBlockUserModal,
    hideResetPasswordModal,
    onBlockUserClick,
    onResetPasswordSubmit,
    deleteUser,
    resetPassword,
    isBlockUserLoading: blockUser.isLoading,
    listUser,
    onWorkspaceChange,
    onStatusChange,
    roles,
    onRoleChange,
    listUserIsSuccess: listUser.isSuccess,
    form,
    onInputChange,
    pagination,
    listUserCount: listUser.data?.totalCount,
    filter,
    listWorkspaces,
    onWorkspaceFilterInputChange,
    workspaceFilterValue,
    workspaceFilterInputRef,
    listRoles,
    onRoleFilterInputChange,
    roleFilterValue,
    roleFilterInputRef,
    userList: listUser.data?.items,
  };
};

export default useListUserController;
