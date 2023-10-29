import { useTranslation } from 'react-i18next';

import usePermissionCheckForRecords from '../../utils/prermission-check-for-records';

const useFieldListComponentController = (contentModalInternalName: string) => {
  const { recordPermissionCheck } = usePermissionCheckForRecords(
    contentModalInternalName
  );

  const { t } = useTranslation();

  return { t, canUpdateRecord: recordPermissionCheck('update') };
};
export default useFieldListComponentController;
