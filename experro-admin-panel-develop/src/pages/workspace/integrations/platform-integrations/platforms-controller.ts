import { useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { SIDEBAR_KEYS } from '../../../../utills';

const usePlatformsController = (
  onMainSidebarActiveItem?: (val: string) => void
) => {
  const { path } = useRouteMatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { path, t };
};

export default usePlatformsController;
