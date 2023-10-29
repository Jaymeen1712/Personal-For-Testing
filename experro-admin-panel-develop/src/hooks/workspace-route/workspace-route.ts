import { useHistory, useParams } from 'react-router-dom';
import { useCallback } from 'react';
import { IWorkspaceParams } from '../../types';

const useWorkspaceRoute = () => {
  const { workspaceId } = useParams<IWorkspaceParams>();
  const { push: historyPush } = useHistory();
  const push = useCallback(
    (url: string) => {
      historyPush(`/workspaces/${workspaceId}${url}`);
    },
    [historyPush, workspaceId]
  );

  return { push };
};

export default useWorkspaceRoute;
