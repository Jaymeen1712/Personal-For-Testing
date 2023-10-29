import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_KEYS } from '../../../utills';
import { useRouteMatch } from 'react-router-dom';

interface IListEnvironments {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useEnvironmentsController = ({
  onMainSidebarActiveItem,
}: IListEnvironments) => {
  const { t } = useTranslation();
  const { path } = useRouteMatch();

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    t,
    path,
  };
};

export default useEnvironmentsController;
