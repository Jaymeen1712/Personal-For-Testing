import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { MenuInfo } from 'rc-menu/lib/interface';

import BulletIcon from '../../../images/icons/bullet-icon';
import { SIDEBAR_KEYS } from '../../../utills';

interface IUseAudienceController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useAudienceController = ({
  onMainSidebarActiveItem,
}: IUseAudienceController) => {
  const { t } = useTranslation();
  const { path } = useRouteMatch();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const history = useHistory();

  const [environment, setEnvironment] = useState<string>(
    // @ts-ignore
    localStorage.getItem(`${workspaceId}/environmentId`)
  );

  const menuItems = useMemo(() => {
    return [
      {
        key: 'all-audiance',
        label: t('common.labels.all'),
        icon: (
          <>
            <div className="folders-icon bullet-icon ant-row">
              <BulletIcon />
            </div>
          </>
        ),
      },
      {
        key: 'customers',
        label: t('common.labels.customers'),
        icon: (
          <>
            <div className="folders-icon bullet-icon ant-row">
              <BulletIcon />
            </div>
          </>
        ),
      },
      {
        key: 'anonymous',
        label: t('common.labels.anonymous'),
        icon: (
          <>
            <div className="folders-icon bullet-icon ant-row">
              <BulletIcon />
            </div>
          </>
        ),
      },
    ];
  }, [t]);

  const onEnvironmentChange = (environment: string) => {
    setEnvironment(environment);
  };

  const onSubSidebarMenuItemClick = (menu: MenuInfo) => {
    if (menu.key === 'all-audiance') {
      history.push(`/workspaces/${workspaceId}/audience`);
    }
  };
  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.AUDIENCE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    environment,
    menuItems,
    onEnvironmentChange,
    path,
    onSubSidebarMenuItemClick,
  };
};

export default useAudienceController;
