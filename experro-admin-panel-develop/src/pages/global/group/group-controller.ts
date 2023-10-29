import { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { SIDEBAR_KEYS } from '../../../utills';

interface IUseGroupController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useGroupController = ({
  onMainSidebarActiveItem,
}: IUseGroupController) => {
  const { path } = useRouteMatch();

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.GLOBAL.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { path };
};

export default useGroupController;
