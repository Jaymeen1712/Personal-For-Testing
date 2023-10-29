import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

const useEnums = () => {
  const { t } = useTranslation();

  const USER_STATUS_LIST = useMemo(
    () => [
      { key: 'invited', label: t('common.labels.invited') },
      { key: 'active', label: t('common.labels.active') },
      { key: 'inactive', label: t('common.labels.inactive') },
      { key: 'blocked', label: t('common.labels.blocked') },
    ],
    [t]
  );

  return {
    USER_STATUS_LIST,
  };
};

export default useEnums;
