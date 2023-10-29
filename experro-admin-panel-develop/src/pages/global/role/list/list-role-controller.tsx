import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { IListGroup, IRole, RowRecord } from '../../../../types';
import {
  API_QUERY_KEY,
  openNotificationWithIcon,
  SIDEBAR_KEYS,
} from '../../../../utills';
import {
  useDeleteGlobalRole,
  useDeleteWorkspaceRole,
  useGetGlobalRoleDetails,
  useGetWorkspaceRoleDetails,
  useListRole,
  useRoleUsers,
} from '../services';
import useError from '../../../../hooks/error';
import queryClient from '../../../../query-client';
import { Button, Dropdown, Menu, Popover } from 'antd';
import EllipsisIcon from '../../../../images/icons/ellipsis-icon';
import useCreateGlobalRole from '../services/create-global-role/create-global-role';
import useCreateWorkspaceRole from '../services/create-workspace-role/create-workspace-role';

interface IUseListRoleController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useListRoleController = ({
  onMainSidebarActiveItem,
}: IUseListRoleController) => {
  const { t } = useTranslation();

  const history = useHistory();

  const [selectedRole, setSelectedRole] = useState<IRole>();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activePanelKeys, setActivePanelKeys] = useState<string | string[]>([]);
  const [cloneWorkspaceId, setCloneWorkspaceId] = useState<string | undefined>(
    ''
  );
  const [roleId, setRoleId] = useState<string>('');
  const [workspaceRoleId, setWorkspaceRoleId] = useState('');

  const listRole = useListRole();
  const deleteGlobalRole = useDeleteGlobalRole();
  const deleteWorkspaceRole = useDeleteWorkspaceRole();
  const roleUsers = useRoleUsers(selectedRole?.id);

  const globalRoleDetails = useGetGlobalRoleDetails(roleId);
  const workspaceRoleDetails = useGetWorkspaceRoleDetails(
    workspaceRoleId,
    cloneWorkspaceId
  );

  const createGlobalRole = useCreateGlobalRole();
  const createWorkspaceRole = useCreateWorkspaceRole();

  useError({
    // @ts-ignore
    mutation: globalRoleDetails,
    entity: t('common.labels.role'),
  });

  useError({
    // @ts-ignore
    mutation: workspaceRoleDetails,
    entity: t('common.labels.role'),
  });

  useError({
    mutation: createGlobalRole,
    entity: t('common.labels.role'),
  });

  useError({
    mutation: createWorkspaceRole,
    entity: t('common.labels.role'),
  });

  // To show error messages based on error code
  useError({
    mutation: deleteGlobalRole,
    entity: t('common.labels.role'),
  });

  // To show error messages based on error code
  useError({
    mutation: deleteWorkspaceRole,
    entity: t('common.labels.role'),
  });

  // To manually handle expand collapse panel for role list
  const activePanelChange = (key: string | string[]) => {
    setActivePanelKeys(key);
  };

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
        setSelectedWorkspaceId(role.workspaceId);
        setIsModalVisible(true);
      }
    },
    [t]
  );

  // Function to navigate to add role page with the role details
  const onCloneClick = useCallback((roleId: string, role: IRole) => {
    if (role.workspaceId) {
      setWorkspaceRoleId(roleId);
      setCloneWorkspaceId(role.workspaceId);
    } else {
      setRoleId(roleId);
    }
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
        history.push(
          `/roles/${roleId}/?editWorkspaceId=${
            role.workspaceId ? role.workspaceId : ''
          }`
        );
      }
    },
    [history, t]
  );

  // Function to navigate to create role page
  const onAddRole = useCallback(() => {
    history.push('/roles/create');
  }, [history]);

  // Function to set role id when clicked on user count popup
  const onRoleCountClick = useCallback((role: IRole) => {
    setSelectedRole(role);
  }, []);

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

  // Column list for role list table
  const columns = useMemo(
    () => [
      {
        dataIndex: 'roleName',
        key: 'roleName',
        width: '35%',
        render: (name: string, row: RowRecord) => {
          return (
            <div className="ant-row ant-space-align-center ant-row-space-between w-100 table-text-button">
              <div className="table-text">
                <div
                  className={`text-truncate with-pixel ${
                    !row.isWorkspaceAdmin && !row.isGlobalAdmin
                      ? 'cursor-pointer text-blue'
                      : ''
                  }`}
                  onClick={
                    !row.isWorkspaceAdmin && !row.isGlobalAdmin
                      ? () => onEditClick(row.id, row)
                      : (e) => e.stopPropagation()
                  }>
                  {row.name ? row.name : '-'}
                </div>
              </div>

              <Dropdown
                placement="bottomRight"
                trigger={['click']}
                overlay={
                  <div className="table-dropdown">
                    <Menu>
                      <Menu.Item
                        key="edit"
                        onClick={() => onEditClick(row.id, row)}>
                        {t('common.labels.edit')}
                      </Menu.Item>

                      <Menu.Item
                        key="clone"
                        onClick={() => onCloneClick(row.id, row)}>
                        {t('common.labels.clone')}
                      </Menu.Item>

                      <Menu.Item
                        //@ts-ignore
                        onClick={() => onDeleteClick(row)}>
                        <p className="text-red m-0">
                          {t('common.labels.delete')}
                        </p>
                      </Menu.Item>
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
            </div>
          );
        },
      },
      {
        dataIndex: 'roleDescription',
        key: 'roleDescription',
        width: '40%',
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
        dataIndex: 'usersInRole',
        key: 'usersInRole',
        width: '25%',
        // rendererType: GRID_RENDERER_TYPE.POPOVER,
        // rendererProps: roleUsersOptions,
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
      onCloneClick,
      onEditClick,
      onDeleteClick,
      t,
      roleUsersDetail,
      onRoleCountClick,
    ]
  );

  // Method to hide role delete modal
  const hideDeleteModal = () => {
    setIsModalVisible(false);
  };

  // Method to delete role
  const onDeleteRole = () => {
    if (selectedRole?.id) {
      if (selectedWorkspaceId) {
        deleteWorkspaceRole.mutate({
          roleId: selectedRole.id,
          workspaceId: selectedWorkspaceId,
        });
      } else {
        deleteGlobalRole.mutate(selectedRole.id);
      }
    }
  };

  useEffect(() => {
    if (deleteGlobalRole.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.ROLE_LIST]);
      hideDeleteModal();
      openNotificationWithIcon(
        'success',
        t('common.messages.role_deleted_successfully')
      );
    }
  }, [deleteGlobalRole.isSuccess, t]);

  useEffect(() => {
    if (deleteWorkspaceRole.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.ROLE_LIST]);
      hideDeleteModal();
      openNotificationWithIcon(
        'success',
        t('common.messages.role_deleted_successfully')
      );
    }
  }, [deleteWorkspaceRole.isSuccess, t]);

  useEffect(() => {
    if (deleteGlobalRole.isError) {
      setIsModalVisible(false);
    }
  }, [deleteGlobalRole.isError]);

  useEffect(() => {
    if (deleteWorkspaceRole.isError) {
      setIsModalVisible(false);
    }
  }, [deleteWorkspaceRole.isError]);

  useEffect(() => {
    if (globalRoleDetails.isSuccess) {
      if (globalRoleDetails.data) {
        createGlobalRole.mutate({
          ...globalRoleDetails.data.item,
          name: `${globalRoleDetails.data.item?.name} copy`,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalRoleDetails.isSuccess]);

  useEffect(() => {
    if (workspaceRoleDetails.isSuccess) {
      if (workspaceRoleDetails.data) {
        createWorkspaceRole.mutate({
          ...workspaceRoleDetails.data.item,
          name: `${workspaceRoleDetails.data.item?.name} copy`,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceRoleDetails.isSuccess]);

  useEffect(() => {
    if (createGlobalRole.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.role_cloned_successfully')
      );
      // @ts-ignore
      history.push(`/roles/${createGlobalRole.data.item.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createGlobalRole.isSuccess]);

  useEffect(() => {
    if (createWorkspaceRole.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.role_cloned_successfully')
      );
      history.push(
        // @ts-ignore
        `/roles/${createWorkspaceRole?.data?.item.id}/?editWorkspaceId=${cloneWorkspaceId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createWorkspaceRole.isSuccess]);

  useEffect(() => {
    if (createGlobalRole.isError) {
      setRoleId('');
    }
  }, [createGlobalRole.isError]);

  useEffect(() => {
    if (createWorkspaceRole.isError) {
      setWorkspaceRoleId('');
      setCloneWorkspaceId('');
    }
  }, [createWorkspaceRole.isError]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.GLOBAL.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    t,
    isModalVisible,
    selectedRole,
    hideDeleteModal,
    onDeleteRole,
    onAddRole,
    columns,
    listRole,
    activePanelKeys,
    activePanelChange,
    deleteWorkspaceRole,
    deleteGlobalRole,
  };
};

export default useListRoleController;
