import { useCallback, useMemo } from 'react';

import useUser from '../../../../hooks/user';
import usePermissions from '../../../../hooks/permissions';

const useFieldPermissionCheck = (selectedContentModalInternalName: string) => {
  const user = useUser();
  const { canManageGlobalWorkspace } = usePermissions();
  const permissions = useMemo(() => user?.user?.permissions || {}, [user]);

  const fieldPermissionCheck = useCallback(
    (type: string, name?: string) => {
      if (selectedContentModalInternalName) {
        if (type === 'update') {
          let result;
          if (
            permissions[
              `content_library.${selectedContentModalInternalName}.field_permissions.${name}.update`
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
              `content_library.${selectedContentModalInternalName}.field_permissions.${name}.read`
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
    fieldPermissionCheck,
  };
};
export default useFieldPermissionCheck;
