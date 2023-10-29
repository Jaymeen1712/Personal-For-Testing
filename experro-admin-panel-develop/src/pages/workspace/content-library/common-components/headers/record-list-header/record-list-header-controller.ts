import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';

import useUser from '../../../../../../hooks/user';
import usePermissionCheckForRecords from '../../../utils/prermission-check-for-records';

const useRecordListHeaderController = (
  selectedContentModalInternalName: string
) => {
  const user = useUser();
  const { recordPermissionCheck } = usePermissionCheckForRecords(
    selectedContentModalInternalName
  );
  const permissions = useMemo(() => user?.user?.permissions || {}, [user]);

  const [canCreateRecord, setCanCreateRecord] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (selectedContentModalInternalName) {
      const canCreateRecord = recordPermissionCheck('create');
      if (canCreateRecord) {
        setCanCreateRecord(true);
      } else {
        setCanCreateRecord(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions, selectedContentModalInternalName]);
  return { t, canCreateRecord };
};
export default useRecordListHeaderController;
