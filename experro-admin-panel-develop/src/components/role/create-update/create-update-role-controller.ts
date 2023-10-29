import { MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';

import {
  useCreateGlobalRole,
  useCreateWorkspaceRole,
  useRoleDetails,
  useUpdateWorkspaceRole,
  useUpdateGlobalRole,
  useListContentModel,
} from '../services';
import {
  FormValueChangeType,
  ISubmitRoleGlobalObjectType,
  ISubmitRoleObjectType,
  ISubmitRoleValuesType,
  IWorkspaceParams,
} from '../../../types';
import {
  APIS_ROUTES,
  API_MUTATION_KEY,
  API_QUERY_KEY,
  ROUTES,
  TEXT_REGEX_PATTERN,
  DESCRIPTION_REGEX_PATTERN,
  openNotificationWithIcon,
  SIDEBAR_KEYS,
} from '../../../utills';
// import { useListWorkspaceLanguage } from '../../../apis/internationalization';
import useQuery from '../../../hooks/queryParameter';
import useError from '../../../hooks/error';
import useWorkspaceRoute from '../../../hooks/workspace-route';
import { useAllWorkspaces } from '../../../apis/authentication';
import queryClient from '../../../query-client';
import { useListEnvironments } from '../../../apis/environments';
import useUser from '../../../hooks/user';

interface IParams {
  roleId?: string;
}

interface IUseCreateUpdateRole {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useCreateUpdateRole = ({
  onMainSidebarActiveItem,
}: IUseCreateUpdateRole) => {
  const { workspaceId } = useParams<IWorkspaceParams>();
  const { roleId } = useParams<IParams>();
  const history = useHistory();
  const { push } = useWorkspaceRoute();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const user = useUser();

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('');
  const [workspaceValue, setWorkspaceValue] = useState<string | undefined>('');
  const [shouldUpdateComponent, setShouldUpdateComponent] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [contentLibraryPermissions, setContentLibraryPermissions] = useState<
    Record<string, boolean>
  >({});
  const [changedFieldsInternalName, setChangedFieldsInternalName] = useState<
    string[]
  >([]);
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState<boolean>(true);

  const query = useQuery();
  const editWorkspaceId: string | null = query.get('editWorkspaceId');
  const createGlobalRole = useCreateGlobalRole();
  const updateGlobalRole = useUpdateGlobalRole(roleId);
  const roleDetails = useRoleDetails(roleId, editWorkspaceId || workspaceId);
  const createWorkspaceRole = useCreateWorkspaceRole(
    editWorkspaceId ||
      selectedWorkspaceId ||
      workspaceId ||
      roleDetails.data?.item?.workspaceId
  );
  const updateWorkspaceRole = useUpdateWorkspaceRole(
    roleId,
    editWorkspaceId || workspaceId || roleDetails.data?.item?.workspaceId
  );
  const workspaces = useAllWorkspaces();
  const currentWorkspaceName = useMemo(
    () =>
      workspaces.data?.find((workspace) => workspace.id === workspaceId)?.name,
    [workspaces.data, workspaceId]
  );
  // const listLanguage = useListWorkspaceLanguage(
  //   editWorkspaceId || selectedWorkspaceId || workspaceId
  // );

  const allContentModels = useListContentModel(
    'collection',
    editWorkspaceId || selectedWorkspaceId || workspaceId
  );

  const listEnvironment = useListEnvironments(
    editWorkspaceId || selectedWorkspaceId || workspaceId
  );

  useError({
    mutation: createGlobalRole,
    entity: t('common.labels.role'),
  });
  useError({
    mutation: createWorkspaceRole,
    entity: t('common.labels.role'),
  });
  useError({
    mutation: updateGlobalRole,
    entity: t('common.labels.role'),
  });
  useError({
    mutation: updateWorkspaceRole,
    entity: t('common.labels.role'),
  });

  const onCancel = () => {
    if (workspaceId) {
      push('/roles');
    } else {
      history.push('/roles');
    }
  };

  // To check if any permissions are selected before submitting permission form
  const checkPermissionSelected = (
    values: ISubmitRoleObjectType | ISubmitRoleGlobalObjectType
  ) => {
    if (!values) return false;
    for (const value of Object.values(values)) {
      if (
        value === true ||
        (typeof value === 'object' && checkPermissionSelected(value))
      ) {
        return true;
      }
    }
    return false;
  };

  // To get contentmodel name when wny field changes its value in permission
  const getObjectKeys = (input: object) => {
    const objectEntries = Object.entries(input);
    return Object.keys(objectEntries[0][1]);
  };

  // To set contentmodel name in state when any field changes it's value.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const onValueChange = (changedValues: FormValueChangeType, allData: any) => {
    const changedFieldInternalName = getObjectKeys(changedValues);
    if (
      !changedFieldsInternalName.some(
        (name) => name === changedFieldInternalName[0]
      )
    ) {
      setChangedFieldsInternalName((previous) => [
        ...previous,
        changedFieldInternalName[0],
      ]);
    }

    if (!workspaceId && (!allData.workspace || !allData.roleName)) {
      setIsSaveButtonVisible(true);
    } else {
      if (workspaceId && !allData.roleName) {
        setIsSaveButtonVisible(true);
      } else {
        setIsSaveButtonVisible(false);
      }
    }
  };

  // To submit all role permissions with validations
  const onFinish = async (values: ISubmitRoleValuesType) => {
    let workspaceRole = {} as ISubmitRoleObjectType;

    let globalRole = {} as ISubmitRoleGlobalObjectType;

    if (values.workspace !== 'global') {
      changedFieldsInternalName.forEach((internalName) => {
        contentLibraryPermissions[internalName] =
          values['contentLibrary'][internalName];
      });
    }

    if (values.roleName.trim().length === 0) {
      form.setFields([
        {
          name: 'roleName',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.roleName.trim().length < 3) {
      form.setFields([
        {
          name: 'roleName',
          errors: [
            t('common.messages.min_length', {
              entity: t('common.labels.role-name'),
            }),
          ],
        },
      ]);
    } else if (values.roleName.trim().length > 255) {
      form.setFields([
        {
          name: 'roleName',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.role-name'),
            }),
          ],
        },
      ]);
    } else if (
      values.roleName.trim().length > 0 &&
      !TEXT_REGEX_PATTERN.test(values.roleName)
    ) {
      form.setFields([
        {
          name: 'roleName',
          errors: [
            t('common.messages.format', {
              entity: t('common.labels.role-name'),
            }),
          ],
        },
      ]);
    } else if (
      values.roleDescription !== undefined &&
      values.roleDescription !== null &&
      values.roleDescription.length > 0 &&
      values.roleDescription.trim().length === 0
    ) {
      form.setFields([
        {
          name: 'roleDescription',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (
      values.roleDescription !== undefined &&
      values.roleDescription !== null &&
      values.roleDescription.length > 2000
    ) {
      form.setFields([
        {
          name: 'roleDescription',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.description'),
            }),
          ],
        },
      ]);
    } else if (
      values.roleDescription !== undefined &&
      values.roleDescription !== null &&
      values.roleDescription.trim().length > 0 &&
      !DESCRIPTION_REGEX_PATTERN.test(values.roleDescription)
    ) {
      form.setFields([
        {
          name: 'roleDescription',
          errors: [
            t('common.messages.format', {
              entity: t('common.labels.description'),
            }),
          ],
        },
      ]);
    } else {
      if (values.workspace === 'global') {
        globalRole = {
          permissions: {
            global: {
              canManageWorkspace: values.canManageWorkspace,
              canManageUserAndSecurity: values.canManageUserAndSecurity,
            },
          },
          name: values.roleName.trim(),
          description: values.roleDescription,
        };
      } else {
        workspaceRole = {
          permissions: {
            contentLibrary: contentLibraryPermissions,
            contentModel: values.contentModel,
            insights: values.insights,
            settings: values.settings,
            personalization: values.personalization,
            merchandising: values.merchandising,
            audience: values.audience,
          },
          isWorkspaceAdmin: false,
          name: values.roleName.trim(),
          description: values.roleDescription,
          workspaceName: workspaceName,
        };
      }

      const checkGlobalValues = checkPermissionSelected(globalRole);
      const checkWorkspaceValue = checkPermissionSelected(workspaceRole);

      if (roleId) {
        if (values.workspace === 'global') {
          if (checkGlobalValues) {
            updateGlobalRole.mutate(globalRole);
          } else {
            openNotificationWithIcon(
              'error',
              t('common.messages.select_one_permission')
            );
          }
        } else {
          if (checkWorkspaceValue) {
            updateWorkspaceRole.mutate(workspaceRole);
          } else {
            openNotificationWithIcon(
              'error',
              t('common.messages.select_one_permission')
            );
          }
        }
      } else {
        if (values.workspace === 'global') {
          if (checkGlobalValues) {
            createGlobalRole.mutate(globalRole);
          } else {
            openNotificationWithIcon(
              'error',
              t('common.messages.select_one_permission')
            );
          }
        } else {
          if (checkWorkspaceValue) {
            createWorkspaceRole.mutate(workspaceRole);
          } else {
            openNotificationWithIcon(
              'error',
              t('common.messages.select_one_permission')
            );
          }
        }
      }
    }
  };

  const onChange = (
    value: string,
    options: { key: string; value: string; children: string }
  ) => {
    setWorkspaceValue(value);
    setWorkspaceName(options.children);
    setSelectedWorkspaceId(options.value);
  };

  const stopPropagation: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation();
  };

  const onBackButtonClick = () => {
    if (workspaceId) {
      push(ROUTES.ROLE_LIST);
    } else {
      history.push(ROUTES.ROLE_LIST);
    }
  };

  useEffect(() => {
    if (createGlobalRole.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.ROLE_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.ALL_ROLE_LIST]);
      form.resetFields();
      openNotificationWithIcon(
        'success',
        t('common.messages.role_added_successfully')
      );
      if (workspaceId) {
        push(ROUTES.ROLE_LIST);
      } else {
        history.push(ROUTES.ROLE_LIST);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createGlobalRole.isSuccess]);

  useEffect(() => {
    if (createWorkspaceRole.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.ROLE_LIST]);
      queryClient.removeQueries([API_QUERY_KEY.ALL_ROLE_LIST]);
      form.resetFields();

      openNotificationWithIcon(
        'success',
        t('common.messages.role_added_successfully')
      );

      setIsSaveButtonVisible(true);
      if (workspaceId) {
        push(ROUTES.ROLE_LIST);
      } else {
        history.push(ROUTES.ROLE_LIST);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createWorkspaceRole.isSuccess]);

  useEffect(() => {
    if (updateGlobalRole.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.ROLE_LIST]);
      queryClient.removeQueries([API_MUTATION_KEY.GET_GLOBAL_ROLE]);
      queryClient.removeQueries([API_QUERY_KEY.ALL_ROLE_LIST]);
      queryClient.removeQueries(['grid', APIS_ROUTES.USERS]);
      queryClient.refetchQueries([API_QUERY_KEY.PERMISSIONS]);
      form.resetFields();
      openNotificationWithIcon(
        'success',
        t('common.messages.role_updated_successfully')
      );
      setIsSaveButtonVisible(true);
      if (workspaceId) {
        push(ROUTES.ROLE_LIST);
      } else {
        history.push(ROUTES.ROLE_LIST);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateGlobalRole.isSuccess]);

  useEffect(() => {
    if (updateWorkspaceRole.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.ROLE_LIST]);
      queryClient.removeQueries([API_MUTATION_KEY.GET_GLOBAL_ROLE]);
      queryClient.removeQueries([API_QUERY_KEY.ALL_ROLE_LIST]);
      queryClient.removeQueries(['grid', APIS_ROUTES.USERS]);
      queryClient.refetchQueries([API_QUERY_KEY.PERMISSIONS]);
      form.resetFields();
      openNotificationWithIcon(
        'success',
        t('common.messages.role_updated_successfully')
      );
      setIsSaveButtonVisible(true);
      if (workspaceId) {
        push(ROUTES.ROLE_LIST);
      } else {
        history.push(ROUTES.ROLE_LIST);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateWorkspaceRole.isSuccess]);

  useEffect(() => {
    if (roleId) {
      if (roleDetails.isSuccess) {
        if (roleDetails.data.item?.workspaceId) {
          setWorkspaceValue(roleDetails.data.item.workspaceId);
          form.setFieldsValue(roleDetails.data.item?.permissions);
          form.setFieldsValue({
            workspace: roleDetails.data.item.workspaceId,
            roleName: roleDetails.data.item.name,
            roleDescription: roleDetails.data.item.description,
          });
          setShouldUpdateComponent(true);

          setContentLibraryPermissions(
            // @ts-ignore
            roleDetails?.data?.item?.permissions?.contentLibrary
          );
        } else {
          setWorkspaceValue('global');
          form.setFieldsValue({
            workspace: 'global',
            roleName: roleDetails.data.item?.name,
            roleDescription: roleDetails.data.item?.description,
          });
          form.setFieldsValue(roleDetails.data.item?.permissions?.global);
        }

        if (
          !workspaceId &&
          roleDetails.data &&
          roleDetails.data.item &&
          !roleDetails.data.item.workspaceId &&
          !roleDetails.data.item.name
        ) {
          setIsSaveButtonVisible(true);
        } else {
          if (!workspaceId && !roleDetails.data) {
            setIsSaveButtonVisible(true);
          } else {
            if (
              workspaceId &&
              roleDetails.data &&
              roleDetails.data.item &&
              !roleDetails.data.item.name
            ) {
              setIsSaveButtonVisible(true);
            } else {
              if (workspaceId && !roleDetails.data) {
                setIsSaveButtonVisible(true);
              } else {
                setIsSaveButtonVisible(false);
              }
            }
          }
        }
      }
    } else {
      setWorkspaceValue(workspaceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleDetails.isSuccess, roleId]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      if (workspaceId) {
        onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
      } else {
        onMainSidebarActiveItem(SIDEBAR_KEYS.GLOBAL.SETTINGS);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    t,
    roleDetails,
    // listLanguage,
    onCancel,
    onFinish,
    onChange,
    form,
    workspaces,
    workspaceValue,
    shouldUpdateComponent,
    stopPropagation,
    roleId,
    workspaceId,
    selectedWorkspaceId,
    editWorkspaceId,
    currentWorkspaceName,
    createGlobalRole,
    createWorkspaceRole,
    updateGlobalRole,
    updateWorkspaceRole,
    allContentModels,
    listEnvironment,
    onValueChange,
    onBackButtonClick,
    isSaveButtonVisible,
    userEmailId: user?.user?.email,
  };
};

export default useCreateUpdateRole;
