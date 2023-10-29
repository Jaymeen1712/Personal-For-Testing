import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_KEYS } from '../../../utills';
import usePermissions from '../../../hooks/permissions';
import { useHistory, useParams } from 'react-router-dom';

interface IUseTokensController {
  onMainSidebarActiveItem?: (val: string) => void;
}

const useTokensController = ({
  onMainSidebarActiveItem,
}: IUseTokensController) => {
  const { t } = useTranslation();
  const permissions = usePermissions();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const history = useHistory();

  const [defaultActiveKey, setDefaultActiveKey] = useState('templates');

  const onTabChange = (tabKey: string) => {
    setDefaultActiveKey(tabKey);
  };

  useEffect(() => {
    if (!permissions.canReadAPIToken() && !permissions.canReadCLIToken()) {
      history.push(`/workspaces/${workspaceId}/dashboard/traffic`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.SETTINGS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    onTabChange,
    defaultActiveKey,
    t,
    canReadAPITokenPermission: permissions.canReadAPIToken(),
    canReadCLITokenPermission: permissions.canReadCLIToken(),
  };
};

export default useTokensController;
