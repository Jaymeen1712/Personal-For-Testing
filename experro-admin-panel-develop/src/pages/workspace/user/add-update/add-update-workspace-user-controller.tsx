import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';

import { IWorkspaceParams, IWorkspaceUser } from '../../../../types';
import {
  APIS_ROUTES,
  API_QUERY_KEY,
  ROUTES,
  openNotificationWithIcon,
  SIDEBAR_KEYS,
} from '../../../../utills';
import useWorkspaceRoute from '../../../../hooks/workspace-route';
import usePermissions from '../../../../hooks/permissions/permissions';
import { useWorkspaces } from '../../../../apis/authentication';
import queryClient from '../../../../query-client';

import {
  useAddWorkspaceUser,
  useDetailsWorkspaceUser,
  useListAllUser,
  useListWorkspaceRole,
} from '../services';

interface IParams {
  userId?: string;
}

interface IUseAddUpdateWorkspaceUser {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useAddUpdateWorkspaceUser = ({
  onMainSidebarActiveItem,
}: IUseAddUpdateWorkspaceUser) => {
  const { workspaceId } = useParams<IWorkspaceParams>();
  const { push } = useWorkspaceRoute();
  const { userId } = useParams<IParams>();
  const history = useHistory();
  const { t } = useTranslation();
  const [disableSave, setIsDisableSave] = useState(true);

  const getUser = useDetailsWorkspaceUser(workspaceId, userId);
  const permissions = usePermissions();
  const addUser = useAddWorkspaceUser(workspaceId, !!userId);
  const [form] = Form.useForm();
  const workspaces = useWorkspaces();
  const workspaceName = useMemo(
    () =>
      workspaces.data?.find((workspace) => workspace.id === workspaceId)?.name,
    [workspaces.data, workspaceId]
  );

  const listRoles = useListWorkspaceRole(workspaceId);

  const listUsers = useListAllUser();

  const onCancel = () => push(ROUTES.USER_LIST);

  const onFinish = async (values: IWorkspaceUser) => {
    if (userId) {
      addUser.mutate({ ...values, userIds: [userId] });
    } else {
      addUser.mutate(values);
    }
  };

  const onAddNewUser = useCallback(() => {
    history.push('/users/create');
  }, [history]);

  const handleFieldChange = () => {
    const values = form.getFieldsValue();
    if (userId) {
      if (values.roles.length > 0) {
        setIsDisableSave(false);
      } else {
        setIsDisableSave(true);
      }
    } else {
      if (values.userIds && values?.roles?.length > 0) {
        setIsDisableSave(false);
      } else {
        setIsDisableSave(true);
      }
    }
  };

  useEffect(() => {
    if (addUser.isSuccess) {
      if (workspaceId) {
        queryClient.removeQueries([API_QUERY_KEY.WORKSPACE_ALL_USERS]);
        queryClient.removeQueries([
          API_QUERY_KEY.WORKSPACE_USER_DETAILS,
          userId,
        ]);
        queryClient.removeQueries(['form-select', APIS_ROUTES.USERS_ALL]);
        queryClient.refetchQueries([API_QUERY_KEY.PERMISSIONS]);
        history.push(`/workspaces/${workspaceId}/users`);
      } else {
        history.push('/users');
      }
      form.resetFields();
      if (userId) {
        openNotificationWithIcon(
          'success',
          t('common.messages.entity_updated_successfully', {
            entity: t('common.labels.user'),
          })
        );
      } else {
        openNotificationWithIcon(
          'success',
          t('common.messages.entity_added_successfully', {
            entity: t('common.labels.user'),
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addUser.isSuccess, t]);

  useEffect(() => {
    if (addUser.isError) {
      openNotificationWithIcon('error', t('common.messages.user_add_error'));
    }
  }, [addUser.isError, t]);

  useEffect(() => {
    if (getUser.isError) {
      push('/users');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUser.isError]);

  const onBackButtonClick = () => {
    push(ROUTES.USER_LIST);
  };

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    userId,
    form,
    t,
    getUser,
    onCancel,
    onFinish,
    workspaceName,
    addUser,
    disableSave,
    handleFieldChange,
    onBackButtonClick,
    permissions,
    listRoles,
    listUsers,
    onAddNewUser,
  };
};

export default useAddUpdateWorkspaceUser;
