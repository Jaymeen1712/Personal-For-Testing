import { useContext, useEffect, useState } from 'react';

import { IContentLibraryFieldPops } from '../../../../../../../../types';
import { ContentLibraryContext } from '../../../../../context';
import useFieldPermissionCheck from '../../../../../utils/field-permission-check';

const useFieldPermission = (
  contentModalInternalName: string,
  data: IContentLibraryFieldPops,
  componentName?: string
) => {
  const { fieldPermissionCheck } = useFieldPermissionCheck(
    contentModalInternalName
  );
  const [canEditField, setCanEditField] = useState(false);
  const contentLibraryContext = useContext(ContentLibraryContext);
  useEffect(() => {
    if (componentName) {
      if (fieldPermissionCheck('update', componentName)) {
        setCanEditField(true);
      } else {
        setCanEditField(false);
      }
    } else if (data?.relationType) {
      if (fieldPermissionCheck('update', data?.internalName?.split('/')[0])) {
        setCanEditField(true);
      } else {
        setCanEditField(false);
      }
    } else {
      if (fieldPermissionCheck('update', data?.name?.split('/')[0])) {
        setCanEditField(true);
      } else {
        setCanEditField(false);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, contentLibraryContext?.contentModalData]);

  return {
    canEditField,
  };
};
export default useFieldPermission;
