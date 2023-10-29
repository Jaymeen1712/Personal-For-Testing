import { useEffect, useState } from 'react';

import { IContentLibraryFieldPops } from '../../../../../../types';
import useFieldPermissionCheck from '../../../utils/field-permission-check';

const useFormFiledController = (
  contentModalInternalName: string,
  props: IContentLibraryFieldPops,
  componentName?: string
) => {
  const { fieldPermissionCheck } = useFieldPermissionCheck(
    contentModalInternalName
  );
  const [canReadOrUpdate, setCanReadOrUpdate] = useState(false);

  useEffect(() => {
    if (componentName) {
      if (
        fieldPermissionCheck('update', componentName) ||
        fieldPermissionCheck('read', componentName)
      ) {
        setCanReadOrUpdate(true);
      } else {
        setCanReadOrUpdate(false);
      }
    } else if (props.relationType) {
      if (
        fieldPermissionCheck('update', props.internalName?.split('/')[0]) ||
        fieldPermissionCheck('read', props.internalName?.split('/')[0])
      ) {
        setCanReadOrUpdate(true);
      } else {
        setCanReadOrUpdate(false);
      }
    } else {
      if (
        fieldPermissionCheck('update', props.name?.split('/')[0]) ||
        fieldPermissionCheck('read', props.name?.split('/')[0])
      ) {
        setCanReadOrUpdate(true);
      } else {
        setCanReadOrUpdate(false);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, contentModalInternalName]);

  return {
    canReadOrUpdate,
  };
};
export default useFormFiledController;
