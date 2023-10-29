import { useTranslation } from 'react-i18next';
import usePermissions from '../../../../hooks/permissions';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { IWorkspaceParams } from '../../../../types';

const useListEmailsController = () => {
  const { t } = useTranslation();
  const permissions = usePermissions();
  const history = useHistory();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const { path } = useRouteMatch();
  const emailRef = useRef(null);

  const [defaultActiveKey, setDefaultActiveKey] = useState<string>();

  const onTabChange = (tabKey: string) => {
    setDefaultActiveKey(tabKey);
    history.push(`/workspaces/${workspaceId}/emails/${tabKey}`);
  };

  useEffect(() => {
    if (defaultActiveKey) {
      history.push(`/workspaces/${workspaceId}/emails/${defaultActiveKey}`);
    } else {
      setDefaultActiveKey('templates');
      history.push(`/workspaces/${workspaceId}/emails/templates`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { t, defaultActiveKey, onTabChange, permissions, path, emailRef };
};

export default useListEmailsController;
