import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router-dom';

import { SIDEBAR_KEYS } from '../../../utills';

interface IUseInternationalizationController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useInternationalizationController = ({
  onMainSidebarActiveItem,
}: IUseInternationalizationController) => {
  const { t } = useTranslation();
  const { path } = useRouteMatch();

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { t, path };
};

export default useInternationalizationController;
