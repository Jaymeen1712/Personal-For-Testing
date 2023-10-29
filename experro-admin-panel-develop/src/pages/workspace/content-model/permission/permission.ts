import { useCallback, useMemo } from 'react';

import { PERMISSIONS } from '../../../../utills';
import useUser from '../../../../hooks/user';

const usePermissions = (modelInternalName: string) => {
  const user = useUser();

  const permissions = useMemo(() => user?.user?.permissions || {}, [user]);

  const canReadContentModel = useCallback(
    (contentModelName: string) =>
      permissions[`content_model.model.permissions.read`] ||
      permissions[`content_model.model.${contentModelName}.permissions.read`] ||
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, modelInternalName]
  );

  const canCreateContentModel = useCallback(
    () =>
      permissions[`content_model.model.permissions.create`] ||
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, modelInternalName]
  );

  const canUpdateContentModel = useCallback(
    (contentModelName: string) =>
      permissions[`content_model.model.permissions.update`] ||
      permissions[
        `content_model.model.${contentModelName}.permissions.update`
      ] ||
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, modelInternalName]
  );

  const canDeleteContentModel = useCallback(
    (contentModelName: string) =>
      permissions[`content_model.model.permissions.delete`] ||
      permissions[
        `content_model.model.${contentModelName}.permissions.delete`
      ] ||
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, modelInternalName]
  );

  const canReadContentModelField = useCallback(
    (contentModelName: string) =>
      permissions[
        `content_model.model.${contentModelName}.field_permissions.read`
      ] || permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, modelInternalName]
  );

  const canCreateContentModelField = useCallback(
    (contentModelName: string) =>
      permissions[
        `content_model.model.${contentModelName}.field_permissions.create`
      ] || permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, modelInternalName]
  );

  const canUpdateContentModelField = useCallback(
    (contentModelName: string) =>
      permissions[
        `content_model.model.${contentModelName}.field_permissions.update`
      ] || permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, modelInternalName]
  );

  const canDeleteContentModelField = useCallback(
    (contentModelName: string) =>
      permissions[
        `content_model.model.${contentModelName}.field_permissions.delete`
      ] || permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, modelInternalName]
  );

  const canCreateComponent = useCallback(
    () =>
      permissions[`content_model.components.permissions.create`] ||
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, modelInternalName]
  );

  const canUpdateComponent = useCallback(
    () =>
      permissions[`content_model.components.permissions.update`] ||
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, modelInternalName]
  );

  const canDeleteComponent = useCallback(
    () =>
      permissions[`content_model.components.permissions.delete`] ||
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, modelInternalName]
  );

  const canCreateRead = useCallback(
    () =>
      permissions[`content_model.components.permissions.read`] ||
      permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, modelInternalName]
  );

  const canManageGlobalWorkspace = useCallback(
    () => permissions[PERMISSIONS['GLOBAL.CAN_MANAGE_WORKSPACE']],
    [permissions]
  );

  return {
    permissions,
    canReadContentModel,
    canCreateContentModel,
    canUpdateContentModel,
    canDeleteContentModel,
    canReadContentModelField,
    canCreateContentModelField,
    canUpdateContentModelField,
    canDeleteContentModelField,
    canCreateComponent,
    canUpdateComponent,
    canDeleteComponent,
    canCreateRead,
    canManageGlobalWorkspace,
  };
};

export default usePermissions;
