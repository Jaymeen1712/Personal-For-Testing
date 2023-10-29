import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import { useEffect, useState } from 'react';

import { ITreeSelectItem, IUser } from '../../../../types';
import {
  API_QUERY_KEY,
  EMAIL_REGEX_PATTERN,
  NAME_REGEX_PATTERN,
  openNotificationWithIcon,
  ROUTES,
} from '../../../../utills';
import queryClient from '../../../../query-client';
import useError from '../../../../hooks/error';
import {
  useCreateUser,
  useDetailsUser,
  useListGroups,
  useListRoles,
  useUpdateUser,
} from '../services';

interface IParams {
  userId?: string;
}

const useCreateUpdateUser = () => {
  const { userId } = useParams<IParams>();
  const history = useHistory();
  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [isAddNewEnabled, setIsAddNewEnabled] = useState(false);

  // const [roleIds, setRoleIds] = useState<string[]>();
  const [roles, setRoles] = useState<ITreeSelectItem[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isSaveAndSaveAddNewDisable, setIsSaveAndSaveAndNewDisable] =
    useState<boolean>(true);

  const createUser = useCreateUser();
  const updateUser = useUpdateUser(userId);
  const getUser = useDetailsUser(userId);

  const listRoles = useListRoles();
  const listGroup = useListGroups();

  useError({
    mutation: createUser,
    entity: t('common.labels.user'),
    dependentEntities: t('common.labels.role_or_group'),
    cb: () => setIsAddNewEnabled(false),
  });

  useError({
    mutation: updateUser,
    entity: t('common.labels.user'),
    dependentEntities: t('common.labels.role_or_group'),
    cb: () => setIsAddNewEnabled(false),
  });

  const onSaveAndAddNewClick = () => {
    setIsAddNewEnabled(true);
  };

  const onFinishFailed = () => {
    setIsAddNewEnabled(false);
  };

  const onCancel = () => history.push(ROUTES.USER_LIST);

  const onChangeRoleTree = (value: string[]) => {
    setSelectedRoles(value);
  };

  const onChangeGroupTree = (values: string[]) => {
    setSelectedGroups(values);
  };

  const onFinish = async (values: IUser) => {
    const roleIds: string[] = [];

    if (values.firstName.trim().length === 0) {
      setIsAddNewEnabled(false);
      form.setFields([
        {
          name: 'firstName',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.firstName.trim().length < 1) {
      setIsAddNewEnabled(false);
      form.setFields([
        {
          name: 'firstName',
          errors: [
            t('common.messages.min_length', {
              entity: t('common.labels.firstName'),
            }),
          ],
        },
      ]);
    } else if (values.firstName.trim().length > 20) {
      setIsAddNewEnabled(false);
      form.setFields([
        {
          name: 'firstName',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.firstName'),
            }),
          ],
        },
      ]);
    } else if (
      values.firstName.trim().length > 0 &&
      !NAME_REGEX_PATTERN.test(values.firstName)
    ) {
      setIsAddNewEnabled(false);
      form.setFields([
        {
          name: 'firstName',
          errors: [
            t('common.messages.format', {
              entity: t('common.labels.firstName'),
            }),
          ],
        },
      ]);
    } else if (values.lastName.trim().length === 0) {
      setIsAddNewEnabled(false);
      form.setFields([
        {
          name: 'lastName',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.lastName.trim().length < 1) {
      setIsAddNewEnabled(false);
      form.setFields([
        {
          name: 'lastName',
          errors: [
            t('common.messages.min_length', {
              entity: t('common.labels.lastName'),
            }),
          ],
        },
      ]);
    } else if (values.lastName.trim().length > 20) {
      setIsAddNewEnabled(false);
      form.setFields([
        {
          name: 'lastName',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.lastName'),
            }),
          ],
        },
      ]);
    } else if (
      values.lastName.trim().length > 0 &&
      !NAME_REGEX_PATTERN.test(values.lastName)
    ) {
      setIsAddNewEnabled(false);
      form.setFields([
        {
          name: 'lastName',
          errors: [
            t('common.messages.format', {
              entity: t('common.labels.lastName'),
            }),
          ],
        },
      ]);
    } else if (
      values.email.trim().length > 0 &&
      !EMAIL_REGEX_PATTERN.test(values.email)
    ) {
      setIsAddNewEnabled(false);
      form.setFields([
        {
          name: 'email',
          errors: [t('common.messages.email_invalid')],
        },
      ]);
    } else if (values.email.trim().length === 0) {
      form.setFields([
        {
          name: 'email',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else {
      values.firstName = values.firstName.trim();
      values.lastName = values.lastName.trim();
      values.roles.forEach((roleId) => {
        const roleCategory = roles.find((role) => role.value === roleId);
        if (roleCategory) {
          if (roleCategory.children) {
            roleIds.push(...roleCategory.children.map((role) => role.value));
          }
        } else {
          roleIds.push(roleId);
        }
      });

      if (userId) {
        updateUser.mutate({ ...values, roles: roleIds });
      } else {
        createUser.mutate({ ...values, roles: roleIds });
      }
    }
  };

  const onBackButtonClick = () => {
    history.push('/users');
  };

  useEffect(() => {
    if (createUser.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.ROLE_LIST]);
      if (isAddNewEnabled) {
        form.resetFields();
        setIsAddNewEnabled(false);
        setIsSaveAndSaveAndNewDisable(true);
      } else {
        setIsSaveAndSaveAndNewDisable(true);
        history.push(ROUTES.USER_LIST);
      }
      openNotificationWithIcon(
        'success',
        t('common.messages.user_added_successfully')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createUser.isSuccess, t]);

  useEffect(() => {
    if (updateUser.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.ROLE_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.USER_DETAILS, userId]);
      queryClient.refetchQueries([API_QUERY_KEY.PERMISSIONS]);
      openNotificationWithIcon(
        'success',
        t('common.messages.user_updated_successfully')
      );
      setIsSaveAndSaveAndNewDisable(true);

      history.push(ROUTES.USER_LIST);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUser.isSuccess, updateUser.isError, userId, t, history]);

  useEffect(() => {
    if (getUser.isSuccess) {
      // setRoleIds(form.getFieldsValue().roles);

      // @ts-ignore
      setSelectedRoles(getUser.data?.roles);
      // @ts-ignore
      setSelectedGroups(getUser.data?.groups);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUser.isSuccess]);

  useEffect(() => {
    if (getUser.isError) {
      history.push('/users');
    }
  }, [getUser.isError, history]);

  useEffect(() => {
    if (listRoles.isSuccess) {
      setRoles(listRoles.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listRoles.isSuccess]);

  const onValueChange = (values: IUser, allValues: IUser) => {
    if (
      !allValues.firstName ||
      !allValues.lastName ||
      !allValues.email ||
      !allValues.roles ||
      allValues.roles.length === 0
    ) {
      setIsSaveAndSaveAndNewDisable(true);
    } else {
      if (
        getUser.data &&
        (!allValues.firstName ||
          !allValues.lastName ||
          !allValues.email ||
          !allValues.roles)
      ) {
        setIsSaveAndSaveAndNewDisable(true);
      } else {
        if (
          getUser.data &&
          allValues.firstName === getUser.data.firstName &&
          allValues.lastName === getUser.data.lastName &&
          allValues.email === getUser.data.email &&
          allValues.roles === getUser.data.roles
        ) {
          setIsSaveAndSaveAndNewDisable(true);
        } else {
          setIsSaveAndSaveAndNewDisable(false);
        }
      }
    }
  };

  return {
    userId,
    form,
    t,
    getUser,
    onCancel,
    onSaveAndAddNewClick,
    onFinish,
    isAddNewEnabled,
    onFinishFailed,
    setRoles,
    createUser,
    updateUser,
    onBackButtonClick,
    listRoles,
    listGroup,
    roles,
    onChangeRoleTree,
    selectedRoles,
    selectedGroups,
    onValueChange,
    isSaveAndSaveAddNewDisable,
    onChangeGroupTree,
  };
};

export default useCreateUpdateUser;
