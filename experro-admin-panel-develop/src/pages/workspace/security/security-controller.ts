import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { SIDEBAR_KEYS } from '../../../utills';

interface IUseSecurityController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useSecurityController = ({
  onMainSidebarActiveItem,
}: IUseSecurityController) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.USER.ACCOUNT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    t,
  };
};

export default useSecurityController;
