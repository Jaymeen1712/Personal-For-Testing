import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Form } from 'antd';

import { IGroup, ITreeSelectItem } from '../../../../types';
import useQuery from '../../../../hooks/queryParameter';
import {
  API_QUERY_KEY,
  APIS_ROUTES,
  DESCRIPTION_REGEX_PATTERN,
  openNotificationWithIcon,
  ROUTES,
} from '../../../../utills';
import queryClient from '../../../../query-client';
import useError from '../../../../hooks/error';
import {
  useCreateGroup,
  useDetailsGroup,
  useListAllGroupUser,
  useListRolesGroup,
  useUpdateGroup,
} from '../services';

interface IParams {
  groupId?: string;
}

const useCreateUpdateGroup = () => {
  const { groupId } = useParams<IParams>();
  const query = useQuery();
  const { t } = useTranslation();
  const history = useHistory();

  const [form] = Form.useForm();
  const [roles, setRoles] = useState<ITreeSelectItem[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isSaveDisable, setIsSaveDisable] = useState<boolean>(true);

  const cloneGroupId: string | null = query.get('groupId');

  const detailsGroup = useDetailsGroup(groupId || cloneGroupId);
  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup(groupId || cloneGroupId);
  const listRoles = useListRolesGroup();
  const listUsers = useListAllGroupUser();

  useError({
    mutation: createGroup,
    entity: t('common.labels.group'),
    dependentEntities: t('common.labels.role_or_user'),
  });

  useError({
    mutation: updateGroup,
    entity: t('common.labels.group'),
    dependentEntities: t('common.labels.role_or_user'),
  });

  const onCancel = () => history.push(ROUTES.GROUP_LIST);

  const onFinish = async (values: IGroup) => {
    const roleIds: string[] = [];

    if (values.name.trim().length === 0) {
      form.setFields([
        {
          name: 'name',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.name.trim().length > 255) {
      form.setFields([
        {
          name: 'name',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.groupName'),
            }),
          ],
        },
      ]);
    } else if (
      values.description !== undefined &&
      values.description !== null &&
      values.description.length > 0 &&
      values.description.trim().length === 0
    ) {
      form.setFields([
        {
          name: 'description',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (
      values.description !== undefined &&
      values.description !== null &&
      values.description.length > 2000
    ) {
      form.setFields([
        {
          name: 'description',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.groupDescription'),
            }),
          ],
        },
      ]);
    } else if (
      values.description !== undefined &&
      values.description !== null &&
      values.description.trim().length > 0 &&
      !DESCRIPTION_REGEX_PATTERN.test(values.description)
    ) {
      form.setFields([
        {
          name: 'description',
          errors: [
            t('common.messages.format', {
              entity: t('common.labels.groupDescription'),
            }),
          ],
        },
      ]);
    } else {
      values.name = values.name.trim();
      values.description = values.description?.trim() || '';
      values.roleIds.forEach((roleId) => {
        const roleCategory = roles.find((role) => role.value === roleId);
        if (roleCategory) {
          if (roleCategory.children) {
            roleIds.push(...roleCategory.children.map((role) => role.value));
          }
        } else {
          roleIds.push(roleId);
        }
      });

      if (groupId || cloneGroupId) {
        updateGroup.mutate({ ...values, roleIds });
      } else {
        createGroup.mutate({ ...values, roleIds });
      }
    }
  };

  const onBackButtonClick = () => {
    history.push(ROUTES.GROUP_LIST);
  };

  const onChangeRoleTree = (value: string[]) => {
    setSelectedRoles(value);
  };

  const onChangeUserTree = (values: string[]) => {
    setSelectedUsers(values);
  };

  useEffect(() => {
    if (createGroup.isSuccess) {
      queryClient.removeQueries(['grid', APIS_ROUTES.GROUP]);
      queryClient.removeQueries([API_QUERY_KEY.GROUP_SEARCH]);
      setIsSaveDisable(true);
      history.push(ROUTES.GROUP_LIST);

      openNotificationWithIcon(
        'success',
        t('common.messages.group_added_successfully')
      );
    }
  }, [createGroup.isSuccess, history, t, cloneGroupId]);

  useEffect(() => {
    if (updateGroup.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.GROUP_DETAIL, groupId]);
      queryClient.removeQueries(['grid', APIS_ROUTES.GROUP]);
      queryClient.removeQueries([API_QUERY_KEY.GROUP_SEARCH]);
      history.push(ROUTES.GROUP_LIST);
      setIsSaveDisable(true);
      openNotificationWithIcon(
        'success',
        t('common.messages.group_updated_successfully')
      );
    }
  }, [history, t, updateGroup.isSuccess, groupId]);

  useEffect(() => {
    if (listRoles.isSuccess) {
      setRoles(listRoles.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listRoles.isSuccess]);

  useEffect(() => {
    if (detailsGroup.isSuccess) {
      // @ts-ignore
      setSelectedRoles(detailsGroup.data?.roleIds);
      // @ts-ignore
      setSelectedUsers(detailsGroup.data?.userIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailsGroup.isSuccess]);

  const onValueChange = (values: IGroup, allValues: IGroup) => {
    if (
      !allValues.name ||
      !allValues.roleIds ||
      allValues.roleIds.length === 0 ||
      !allValues.userIds ||
      allValues.userIds.length === 0
    ) {
      setIsSaveDisable(true);
    } else {
      if (
        detailsGroup.data &&
        allValues.name === detailsGroup.data.name &&
        allValues.roleIds.length === detailsGroup.data.roleIds.length &&
        allValues.userIds.length === detailsGroup.data.userIds.length &&
        (allValues.userIds.length === 0 || allValues.roleIds.length === 0)
      ) {
        setIsSaveDisable(true);
      } else {
        setIsSaveDisable(false);
      }
    }
  };

  return {
    onFinish,
    detailsGroup,
    groupId,
    onCancel,
    t,
    cloneGroupId,
    updateGroup,
    createGroup,
    form,
    onBackButtonClick,
    listRoles,
    listUsers,
    onChangeRoleTree,
    selectedRoles,
    selectedUsers,
    onValueChange,
    isSaveDisable,
    onChangeUserTree,
  };
};

export default useCreateUpdateGroup;
