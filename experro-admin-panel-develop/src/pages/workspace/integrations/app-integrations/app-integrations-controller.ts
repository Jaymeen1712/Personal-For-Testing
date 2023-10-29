import { useTranslation } from 'react-i18next';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SIDEBAR_KEYS } from '../../../../utills';

interface IUseAppIntegrationsController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useAppIntegrationsController = ({
  onMainSidebarActiveItem,
}: IUseAppIntegrationsController) => {
  const { path } = useRouteMatch();
  const { t } = useTranslation();
  const location = useLocation();

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    if (location.pathname.split('/').length > 4) {
      setIsHeaderVisible(false);
    } else {
      setIsHeaderVisible(true);
    }
  }, [location]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { t, path, isHeaderVisible };
};
export default useAppIntegrationsController;
