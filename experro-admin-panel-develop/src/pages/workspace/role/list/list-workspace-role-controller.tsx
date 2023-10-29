import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Menu, Popover } from 'antd';
import { useParams } from 'react-router-dom';

import {
  IListGroup,
  IListWorkspaceRole,
  IRole,
  IWorkspaceParams,
} from '../../../../types';
import {
  APIS_ROUTES,
  API_QUERY_KEY,
  openNotificationWithIcon,
  SIDEBAR_KEYS,
} from '../../../../utills';
import {
  useCreateWorkspaceRole,
  useDeleteWorkspaceRole,
  useGetWorkspaceRoleDetails,
  useWorkspaceRoleUsers,
} from '../services';
import useError from '../../../../hooks/error';
import useWorkspaceRoute from '../../../../hooks/workspace-route';
import usePermissions from '../../../../hooks/permissions/permissions';
import queryClient from '../../../../query-client';
import useListWorkspaceRole from '../services/workspace-role';
import EllipsisIcon from '../../../../images/icons/ellipsis-icon';

interface IUseListWorkspaceRoleController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useListWorkspaceRoleController = ({
  onMainSidebarActiveItem,
}: IUseListWorkspaceRoleController) => {
  const { workspaceId } = useParams<IWorkspaceParams>();
  const { t } = useTranslation();
  const { push } = useWorkspaceRoute();
  const [selectedRole, setSelectedRole] = useState<IRole>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [columnSortOrder, setColumnSortOrder] = useState<ISortDataObject>({
  //   sortBy: '',
  //   orderBy: '',
  // });
  const [roleId, setRoleId] = useState<string>('');

  const roleUsers = useWorkspaceRoleUsers(selectedRole?.id, workspaceId);
  const workspaceRole = useListWorkspaceRole(
    workspaceId
    // columnSortOrder.orderBy,
    // columnSortOrder.sortBy
  );
  const workspaceRoleDetails = useGetWorkspaceRoleDetails(roleId, workspaceId);
  const createWorkspaceRole = useCreateWorkspaceRole(workspaceId);
  const deleteWorkspaceRole = useDeleteWorkspaceRole();
  const permissions = usePermissions();

  useError({
    // @ts-ignore
    mutation: workspaceRoleDetails,
    entity: t('common.labels.role'),
  });

  useError({
    mutation: createWorkspaceRole,
    entity: t('common.labels.role'),
  });

  // To show error messages based on error code
  useError({
    mutation: deleteWorkspaceRole,
    entity: t('common.labels.role'),
  });

  // Function to set role ID when clicked on delete option
  const onDeleteClick = useCallback(
    (role: IRole) => {
      if (role.isGlobalAdmin) {
        openNotificationWithIcon(
          'error',
          t('common.messages.global_admin_delete_message')
        );
      } else if (role.isWorkspaceAdmin) {
        openNotificationWithIcon(
          'error',
          t('common.messages.workspace_admin_delete_message')
        );
      } else {
        setSelectedRole(role);
        // setSelectedWorkspaceId(role.workspaceId);
        setIsModalVisible(true);
      }
    },
    [t]
  );

  // Function to navigate to add role page with the role details
  const onCloneClick = useCallback((roleId: string) => {
    setRoleId(roleId);
  }, []);

  // Function to navigate to edit role page when clicked on edit button
  const onEditClick = useCallback(
    (roleId: string, role: IRole) => {
      if (role.isGlobalAdmin) {
        openNotificationWithIcon(
          'error',
          t('common.messages.global_admin_edit_message')
        );
      } else if (role.isWorkspaceAdmin) {
        openNotificationWithIcon(
          'error',
          t('common.messages.workspace_admin_edit_message')
        );
      } else {
        push(`/roles/${roleId}`);
      }
    },
    [push, t]
  );

  // Function to navigate to create role page
  const onAddRole = useCallback(() => {
    push('/roles/create');
  }, [push]);

  // Function to set role id when clicked on user count popup
  const onRoleCountClick = (role: IRole) => {
    setSelectedRole(role);
  };

  // Callback Function to show user first name and last name in role list column
  const roleUsersDetail = useCallback(() => {
    if (roleUsers.data?.length) {
      return roleUsers.data.map((user) => (
        <p key={user.email} className="group-users">
          <strong>
            {user.firstName} {user.lastName}
          </strong>
          {user.email}
        </p>
      ));
    }
    return;
  }, [roleUsers]);

  // //@ts-ignore
  // const onChangeTable = (pagination, filter, sorter) => {
  //   if (sorter.order === 'ascend') {
  //     setColumnSortOrder({
  //       sortBy: camelToSnackCase(sorter.field),
  //       orderBy: 'asc',
  //     });
  //   } else if (sorter.order === 'descend') {
  //     setColumnSortOrder({
  //       sortBy: camelToSnackCase(sorter.field),
  //       orderBy: 'desc',
  //     });
  //   } else {
  //     setColumnSortOrder({
  //       sortBy: '',
  //       orderBy: '',
  //     });
  //   }
  // };

  // useEffect(() => {
  //   workspaceRole.refetch();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [columnSortOrder]);
  // Column list for role list table
  const columns = useMemo(
    () => [
      {
        title: t('common.labels.name'),
        dataIndex: 'name',
        key: 'name',
        width: '35%',
        // sorter: true,
        render: (name: string, row: IListWorkspaceRole) => {
          return (
            <>
              <div className="ant-row ant-space-align-center ant-row-space-between w-100 table-text-button">
                <div className="table-text">
                  <div
                    className={`text-truncate with-pixel ${
                      !row.isWorkspaceAdmin &&
                      permissions.canUpdateRole() &&
                      permissions.canReadRole()
                        ? 'cursor-pointer text-blue'
                        : ''
                    }`}
                    onClick={
                      !row.isWorkspaceAdmin &&
                      permissions.canUpdateRole() &&
                      permissions.canReadRole()
                        ? () => onEditClick(row.id, row)
                        : (e) => e.stopPropagation()
                    }>
                    {row.name ? row.name : '-'}
                  </div>
                </div>

                {permissions.canReadRole() &&
                  (permissions.canUpdateRole() ||
                    permissions.canDeleteRole()) && (
                    <Dropdown
                      placement="bottomRight"
                      trigger={['click']}
                      overlay={
                        <div className="table-dropdown">
                          <Menu>
                            {permissions.canUpdateRole() && (
                              <Menu.Item
                                key="edit"
                                onClick={() => onEditClick(row.id, row)}>
                                {t('common.labels.edit')}
                              </Menu.Item>
                            )}

                            {permissions.canUpdateRole() &&
                              permissions.canCreateRole() && (
                                <Menu.Item
                                  key="clone"
                                  onClick={() => onCloneClick(row.id)}>
                                  {t('common.labels.clone')}
                                </Menu.Item>
                              )}

                            {permissions.canDeleteRole() && (
                              <Menu.Item
                                //@ts-ignore
                                onClick={() => onDeleteClick(row)}>
                                <p className="text-red m-0">
                                  {t('common.labels.delete')}
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
        },
      },
      {
        title: t('common.labels.description'),
        dataIndex: 'description',
        key: 'description',
        width: '40%',
        // sorter: true,
        render: (description: string, record: object) => (
          <>
            <div className="text-truncate with-pixel">
              {/*@ts-ignore*/}
              {record.description ? record.description : '-'}
            </div>
          </>
        ),
      },
      {
        title: t('common.labels.users'),
        dataIndex: 'userCount',
        key: 'userCount',
        width: '25%',
        render: (useCount: number, row: IListGroup) => {
          return (
            <>
              {row.userCount !== 0 ? (
                <div
                  className="cursor-pointer"
                  onMouseOver={() => onRoleCountClick(row)}>
                  <Popover placement="bottomRight" content={roleUsersDetail}>
                    {`${row.userCount} ${t('common.labels.user')}`}
                  </Popover>
                </div>
              ) : (
                <div className="">{`${row.userCount} ${t(
                  'common.labels.user'
                )}`}</div>
              )}
            </>
          );
        },
      },
    ],
    [
      t,
      onCloneClick,
      onEditClick,
      onDeleteClick,
      permissions,
      roleUsersDetail,
      // columnSortOrder,
    ]
  );

  // Method to hide role delete modal
  const hideDeleteModal = () => {
    setIsModalVisible(false);
  };

  // Method to delete role
  const onDeleteRole = async () => {
    if (selectedRole?.id) {
      await deleteWorkspaceRole.mutateAsync({
        roleId: selectedRole.id,
        workspaceId: workspaceId,
      });
    }
  };

  useEffect(() => {
    if (deleteWorkspaceRole.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.ROLE_LIST]);
      hideDeleteModal();
      openNotificationWithIcon(
        'success',
        t('common.messages.role_deleted_successfully')
      );
      queryClient.removeQueries([
        'grid',
        `${APIS_ROUTES.WORKSPACES}/${workspaceId}/roles`,
      ]);
      queryClient.removeQueries([
        API_QUERY_KEY.WORKSPACE_ROLE_LIST,
        workspaceId,
      ]);
    }
  }, [deleteWorkspaceRole.isSuccess, t, workspaceId]);

  useEffect(() => {
    if (deleteWorkspaceRole.isError) {
      setIsModalVisible(false);
    }
  }, [deleteWorkspaceRole.isError]);

  useEffect(() => {
    if (workspaceRoleDetails.isSuccess) {
      if (workspaceRoleDetails.data) {
        // @ts-ignore
        createWorkspaceRole.mutate({
          ...workspaceRoleDetails.data.item,
          name: `${workspaceRoleDetails.data.item?.name} copy`,
          isWorkspaceAdmin: false,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceRoleDetails.isSuccess]);

  useEffect(() => {
    if (createWorkspaceRole.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.role_cloned_successfully')
      );
      // @ts-ignore
      push(`/roles/${createWorkspaceRole.data.item.id}`);
      queryClient.removeQueries([API_QUERY_KEY.ROLE_LIST]);
      queryClient.removeQueries([
        API_QUERY_KEY.WORKSPACE_ROLE_LIST,
        workspaceId,
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createWorkspaceRole.isSuccess]);

  useEffect(() => {
    if (createWorkspaceRole.isError) {
      setRoleId('');
    }
  }, [createWorkspaceRole.isError]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    t,
    isWorkspaceRolesListLoading: workspaceRole.isLoading,
    isWorkspaceRoleListingFetching: workspaceRole.isFetching,
    isModalVisible,
    selectedRole,
    hideDeleteModal,
    onDeleteRole,
    onAddRole,
    columns,
    canCreateRole: permissions.canCreateRole(),
    deleteWorkspaceRole,
    workspaceRole: workspaceRole.data,
    // onChangeTable,
  };
};

export default useListWorkspaceRoleController;
