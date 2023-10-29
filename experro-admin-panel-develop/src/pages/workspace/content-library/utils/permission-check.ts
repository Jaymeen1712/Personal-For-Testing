import { useCallback, useContext } from 'react';

import useUser from '../../../../hooks/user';
import { ContentLibraryContext } from '../context';
import usePermissions from '../../../../hooks/permissions';

const usePermissionCheck = () => {
  const user = useUser();
  const { canManageGlobalWorkspace } = usePermissions();
  const contentLibraryContext = useContext(ContentLibraryContext);

  const fieldPermissionCheck = useCallback(
    (type: string, name?: string) => {
      if (type === 'edit') {
        if (contentLibraryContext?.subSidebarActiveItemKey?.id) {
          let result;
          if (
            user?.user?.permissions[
              `content_library.${
                contentLibraryContext?.contentModalData[
                  contentLibraryContext?.subSidebarActiveItemKey?.id
                ]
              }.field_permissions.${name}.update`
            ] ||
            canManageGlobalWorkspace()
          ) {
            result = true;
          } else {
            result = false;
          }
          return result;
        }
      } else if (type === 'read') {
        if (contentLibraryContext?.subSidebarActiveItemKey?.id) {
          let result;
          if (
            user?.user?.permissions[
              `content_library.${
                contentLibraryContext?.contentModalData[
                  contentLibraryContext?.subSidebarActiveItemKey?.id
                ]
              }.field_permissions.${name}.read`
            ] ||
            canManageGlobalWorkspace()
          ) {
            result = true;
          } else {
            result = false;
          }
          return result;
        }
      } else {
        return false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      contentLibraryContext?.subSidebarActiveItemKey?.id,
      contentLibraryContext?.contentModalData,
    ]
  );

  return {
    fieldPermissionCheck,
  };
};
export default usePermissionCheck;
