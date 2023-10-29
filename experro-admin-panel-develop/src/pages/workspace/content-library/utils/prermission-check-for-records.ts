import { useCallback, useMemo } from 'react';

import useUser from '../../../../hooks/user';
import usePermissions from '../../../../hooks/permissions';

const usePermissionCheckForRecords = (
  selectedContentModalInternalName: string
) => {
  const user = useUser();
  const { canManageGlobalWorkspace } = usePermissions();
  const permissions = useMemo(() => user?.user?.permissions || {}, [user]);

  const recordPermissionCheck = useCallback(
    (type: string, environmentId?: string | null) => {
      if (selectedContentModalInternalName) {
        if (type === 'create') {
          let result;
          if (
            permissions[
              `content_library.${selectedContentModalInternalName}.permissions.create`
            ] ||
            canManageGlobalWorkspace()
          ) {
            result = true;
          } else {
            result = false;
          }
          return result;
        }
        if (type === 'update') {
          let result;
          if (
            permissions[
              `content_library.${selectedContentModalInternalName}.permissions.update`
            ] ||
            canManageGlobalWorkspace()
          ) {
            result = true;
          } else {
            result = false;
          }
          return result;
        }
        if (type === 'read') {
          let result;
          if (
            permissions[
              `content_library.${selectedContentModalInternalName}.permissions.read`
            ] ||
            canManageGlobalWorkspace()
          ) {
            result = true;
          } else {
            result = false;
          }
          return result;
        }
        if (type === 'delete') {
          let result;
          if (
            permissions[
              `content_library.${selectedContentModalInternalName}.permissions.delete`
            ] ||
            canManageGlobalWorkspace()
          ) {
            result = true;
          } else {
            result = false;
          }
          return result;
        }
        if (type === 'publish') {
          let result;
          if (
            permissions[
              `content_library.${selectedContentModalInternalName}.publish.${environmentId}`
            ] ||
            canManageGlobalWorkspace()
          ) {
            result = true;
          } else {
            result = false;
          }
          return result;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedContentModalInternalName, permissions]
  );

  return {
    recordPermissionCheck,
  };
};

export default usePermissionCheckForRecords;
