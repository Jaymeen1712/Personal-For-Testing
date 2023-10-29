import { useCallback, useEffect } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { MenuInfo } from 'rc-menu/lib/interface';
import { useTranslation } from 'react-i18next';

import { SIDEBAR_KEYS } from '../../../utills';
import { IWorkspaceParams } from '../../../types';

interface IUseEmailsController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useEmailsController = ({
  onMainSidebarActiveItem,
}: IUseEmailsController) => {
  const { path } = useRouteMatch();
  const { t } = useTranslation();
  const history = useHistory();
  const { workspaceId } = useParams<IWorkspaceParams>();

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubSideBarMenuItemClick = useCallback(
    (menu: MenuInfo) => {
      if (menu.key === 'workspace.settings.general.emails') {
        history.push(`/workspaces/${workspaceId}/emails/templates`);
      }
    },
    [history, workspaceId]
  );

  return { path, t, onSubSideBarMenuItemClick };
};

export default useEmailsController;
